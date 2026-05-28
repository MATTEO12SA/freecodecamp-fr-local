const chokidar = require('chokidar');
const fs = require('fs');
const nodePath = require('path');

const { sortBy } = require('lodash');

const {
  getSuperblockStructure
} = require('@freecodecamp/curriculum/file-handler');
const {
  superBlockToFilename
} = require('@freecodecamp/curriculum/build-curriculum');

const { createChallengeNode } = require('./create-challenge-nodes');
const {
  createChallengePages,
  getTemplateComponent
} = require('../../../client/utils/gatsby');

// createPagesStatefully only runs once, but we need the following when
// updating challenges, so they have to be stored in memory.
let allChallengeNodes;
const filepathToStatefullyCreatedNodes = new Map();
const filePathToCreatedNodes = new Map();
// reverse lookup, to detect if an updated file has "overwritten" another file
// (i.e. the updated file now has the same node id as another file).
const idToFilepath = new Map();
// recently overwritten files
const idToOverwrittenFile = new Map();
const latestLogFile = nodePath.resolve(
  __dirname,
  '../../../dev-logs/latest.log'
);

function writeLatestLog(level, event, message) {
  try {
    fs.mkdirSync(nodePath.dirname(latestLogFile), { recursive: true });
    fs.appendFileSync(
      latestLogFile,
      `${new Date().toISOString()} [${level}] [${event}] ${message}\n`,
      'utf8'
    );
  } catch {
    // Logging must never break Gatsby's watcher.
  }
}

function logWatcherInfo(reporter, event, message) {
  reporter.info(message);
  writeLatestLog('INFO', event, message);
}

function logWatcherWarn(reporter, event, message) {
  reporter.warn(message);
  writeLatestLog('WARN', event, message);
}

function logWatcherError(reporter, event, message) {
  reporter.error(message);
  writeLatestLog('ERROR', event, message);
}

exports.sourceNodes = function sourceChallengesSourceNodes(
  { actions, reporter, createNodeId, createContentDigest },
  pluginOptions
) {
  const { source, onSourceChange, curriculumPath } = pluginOptions;
  if (typeof source !== 'function') {
    reporter.panic(`
    "source" is a required option for fcc-source-challenges. It must be a
    function that delivers challenge objects to the plugin
    `);
  }
  if (typeof onSourceChange !== 'function') {
    reporter.panic(`
    "onSourceChange" is a required option for fcc-source-challenges. It must be
    a function that delivers a new challenge object to the plugin
    `);
  }
  if (typeof curriculumPath !== 'string') {
    reporter.panic(`
    "curriculumPath" is a required option for fcc-source-challenges. It must be
    a path to a curriculum directory
    `);
  }
  const { createNode, deleteNode, deletePage } = actions;

  // Platform-aware watching. On this Windows + Defender setup chokidar's
  // polling reliably MISSED .md events anyway while still costing one stat()
  // per watched file per interval (1700+ files), so on Windows we keep
  // polling OFF (chokidar stays cheap/best-effort) and let the Node-native
  // fallbacks below do the real work. On Linux/macOS chokidar is the primary
  // watcher and the native fallbacks are disabled to avoid processing every
  // change twice.
  const isWindows = process.platform === 'win32';
  const useNativeWatch =
    isWindows || process.env.FCC_FORCE_NATIVE_WATCH === 'true';
  const watchInterval = Number(process.env.FCC_WATCH_INTERVAL) || 1000;
  // Debounce identical 'changed' events: overlapping watchers, or editors that
  // write a file twice on save, would otherwise run the integration pipeline
  // more than once per edit.
  const CHANGE_DEBOUNCE_MS = 700;
  const lastHandledAt = new Map();

  const watcher = chokidar.watch(curriculumPath, {
    ignored: /(^|[/\\])\../,
    ignoreInitial: true,
    persistent: true,
    cwd: curriculumPath,
    usePolling: false,
    awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 100 },
    atomic: 100
  });

  // Diagnostic logs are mirrored into dev-logs/latest.log so the launcher log
  // shows both server readiness and translation integration events.
  ['ready', 'error'].forEach(evt => {
    watcher.on(evt, payload => {
      const message = `[fcc-source-challenges chokidar] ${evt}${payload ? ' ' + payload : ''}`;
      if (evt === 'error') {
        logWatcherError(reporter, 'watcher.error', message);
      } else {
        logWatcherInfo(reporter, 'watcher.ready', message);
      }
    });
  });
  ['change', 'add', 'unlink'].forEach(evt => {
    watcher.on(evt, p => {
      const message = `[fcc-source-challenges chokidar] ${evt} ${p}`;
      logWatcherInfo(reporter, `watcher.${evt}`, message);
    });
  });

  function deletePages(filePath) {
    const statefulNodes = filepathToStatefullyCreatedNodes.get(filePath) || [];
    statefulNodes.forEach(node => {
      deleteNode(node);
      deletePage({
        path: node.challenge.fields.slug,
        component: getTemplateComponent(node.challenge.challengeType)
      });
      idToFilepath.delete(node.id);
    });

    const createdNodes = filePathToCreatedNodes.get(filePath) || [];
    createdNodes.forEach(node => {
      deleteNode(node);
      idToFilepath.delete(node.id);
    });

    filepathToStatefullyCreatedNodes.delete(filePath);
    filePathToCreatedNodes.delete(filePath);
  }

  function tryToDeletePages(filePath) {
    const oldCreatedNodeIds = (filePathToCreatedNodes.get(filePath) ?? []).map(
      node => node.id
    );

    const oldStatefullyCreatedNodeIds = (
      filepathToStatefullyCreatedNodes.get(filePath) ?? []
    ).map(node => node.id);

    const oldNodeIds = [...oldCreatedNodeIds, ...oldStatefullyCreatedNodeIds];

    const overwrittenFiles = new Set(
      oldNodeIds.map(id => idToOverwrittenFile.get(id))
    );

    if (overwrittenFiles.has(filePath)) {
      // since this has already been overwritten, it doesn't need
      // deleting, but there's no longer any need to track that it was
      // overwritten.
      oldNodeIds.forEach(id => {
        idToOverwrittenFile.delete(id);
      });
    } else {
      deletePages(filePath);
    }
  }

  function handleChallengeUpdate(filePath, action = 'changed') {
    // Drop duplicate 'changed' events for the same file within a short window
    // (overlapping watchers / double-save editors).
    if (action === 'changed') {
      const now = Date.now();
      const previous = lastHandledAt.get(filePath);
      if (previous && now - previous < CHANGE_DEBOUNCE_MS) return;
      lastHandledAt.set(filePath, now);
    }
    writeLatestLog(
      'INFO',
      'challenge.integrating',
      `Challenge file ${action}: ${filePath}`
    );
    // Superblock structure comes from curriculum/structure/*.json, not from the
    // challenge .md being edited, so a pure content change can't alter it. Only
    // rebuild structure nodes when a file is added or removed (which can change
    // a block's set of challenges).
    if (action !== 'changed') createSuperBlockStructureNodes();
    if (action === 'deleted') {
      // We have to return before calling onSourceChange, since the file is
      // gone.
      return tryToDeletePages(filePath);
    }

    return onSourceChange(filePath)
      .then(challenges => {
        const actionText = action === 'added' ? 'creating' : 'replacing';
        const message = `Challenge file ${action}: ${filePath}, ${actionText} challengeNodes with ids ${challenges.map(({ id }) => id).join(', ')}`;
        reporter.info(message);

        if (action === 'changed') {
          tryToDeletePages(filePath);
        }

        const challengeNodes = challenges.map(challenge =>
          reportNodeCreationToGatsby(challenge, {
            isReloading: true
          })
        );

        // Track if file has been overwritten.
        challengeNodes.forEach(({ id }) => {
          const maybeFilepath = idToFilepath.get(id);
          if (maybeFilepath) {
            idToOverwrittenFile.set(id, maybeFilepath);
          }
        });

        challengeNodes.forEach(node => {
          idToFilepath.set(node.id, filePath);
        });

        // we always need to track the created nodes to ensure the pages get
        // recreated.
        filePathToCreatedNodes.set(filePath, challengeNodes);
        writeLatestLog(
          'INFO',
          'challenge.integrated',
          `${message}; Gatsby will rebuild page-data.`
        );
      })
      .catch(e => {
        const message = `fcc-replace-challenge\nattempting to replace ${filePath}\n\n${e.message}\n${e.stack ? `  ${e.stack}` : ''}`;
        logWatcherError(reporter, 'challenge.error', message);
      });
  }

  // On file change, replace only the changed challenge. The key is ensuring
  // onSourceChange returns a challenge with complete metadata.
  watcher.on('change', filePath =>
    /\.md?$/.test(filePath) ? handleChallengeUpdate(filePath, 'changed') : null
  );

  // On file add, replace just the new challenge.
  watcher.on('add', filePath => {
    if (!/\.md?$/.test(filePath)) return;
    maybeTouchForNewBlock(filePath);
    handleChallengeUpdate(filePath, 'added');
  });

  watcher.on('unlink', filePath => {
    if (!/\.md?$/.test(filePath)) return;
    handleChallengeUpdate(filePath, 'deleted');
  });

  // Fallback : on this Windows setup chokidar's polling sometimes misses
  // events (suspected antivirus interference). fs.watchFile uses Node's
  // built-in stat-poll which goes through a different code path and reliably
  // fires when mtime changes. We register one watcher per .md file.
  function attachFsWatchFileFallback() {
    let attached = 0;
    function walkDir(dir) {
      let entries;
      try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        const full = nodePath.join(dir, entry.name);
        if (entry.isDirectory()) {
          walkDir(full);
        } else if (/\.md?$/.test(entry.name)) {
          attachWatchFile(full);
          attached += 1;
        }
      }
    }
    function attachWatchFile(absPath) {
      fs.watchFile(absPath, { interval: watchInterval }, (curr, prev) => {
        if (curr.mtimeMs === prev.mtimeMs) return;
        const relPath = nodePath.relative(curriculumPath, absPath);
        logWatcherInfo(
          reporter,
          'watcher.changed',
          `[fcc-source-challenges fs.watchFile] change ${relPath}`
        );
        handleChallengeUpdate(relPath, 'changed');
      });
    }
    walkDir(curriculumPath);
    logWatcherInfo(
      reporter,
      'watcher.ready',
      `[fcc-source-challenges fs.watchFile] watching ${attached} .md files in ${curriculumPath}`
    );
  }
  if (useNativeWatch) attachFsWatchFileFallback();

  // has-french-intro.ts uses a preval that scans this directory at compile
  // time. When a brand-new block is translated (first .md appears under
  // blocks/<new-block>/), we touch the source file so Webpack re-runs the
  // preval and the new block enters the Set without a server restart.
  const hasFrenchIntroPath = nodePath.resolve(
    __dirname,
    '../../../client/src/utils/has-french-intro.ts'
  );
  const knownTranslatedBlocks = new Set();
  function initKnownTranslatedBlocks() {
    const blocksRoot = nodePath.join(curriculumPath, 'blocks');
    if (!fs.existsSync(blocksRoot)) return;
    for (const entry of fs.readdirSync(blocksRoot)) {
      try {
        if (fs.statSync(nodePath.join(blocksRoot, entry)).isDirectory()) {
          knownTranslatedBlocks.add(entry);
        }
      } catch {
        // ignore unreadable entries
      }
    }
  }
  initKnownTranslatedBlocks();
  function touchHasFrenchIntro(reason) {
    if (!fs.existsSync(hasFrenchIntroPath)) return;
    try {
      const now = new Date();
      fs.utimesSync(hasFrenchIntroPath, now, now);
      logWatcherInfo(
        reporter,
        'watcher.touched',
        `[fcc-source-challenges] touched has-french-intro.ts (${reason})`
      );
    } catch (e) {
      logWatcherWarn(
        reporter,
        'watcher.error',
        `[fcc-source-challenges] failed to touch has-french-intro.ts: ${e.message}`
      );
    }
  }

  // When the first .md of a never-before-seen block appears, touch
  // has-french-intro.ts so Webpack re-evaluates its preval and the new block
  // enters the translated-superblocks Set live (no server restart). Shared by
  // the chokidar 'add' handler and the native fs.watch handler.
  function maybeTouchForNewBlock(relFilename) {
    const parts = relFilename.split(/[/\\]/);
    if (parts.length >= 3 && parts[0] === 'blocks') {
      const blockName = parts[1];
      if (!knownTranslatedBlocks.has(blockName)) {
        knownTranslatedBlocks.add(blockName);
        touchHasFrenchIntro(`new block ${blockName}`);
      }
    }
  }

  // Detect .md files CREATED after server startup (which fs.watchFile cannot
  // see, since it only watches paths registered at boot). fs.watch on
  // directories with { recursive: true } fires on rename events for
  // creation/deletion, and on Windows is implemented via ReadDirectoryChangesW
  // (native + reliable). When a new .md appears, we attach a fs.watchFile on
  // it AND immediately trigger an "added" update so Gatsby sources the node.
  const watchedNewFiles = new Set();
  function watchForNewFiles() {
    try {
      fs.watch(
        curriculumPath,
        { recursive: true, persistent: true },
        (eventType, filename) => {
          if (!filename || !/\.md$/.test(filename)) return;
          const absPath = nodePath.join(curriculumPath, filename);
          // rename event covers both creation and deletion. We only act on
          // creation (file exists now) and only if we haven't seen this path.
          if (eventType !== 'rename') return;
          if (watchedNewFiles.has(absPath)) return;
          if (!fs.existsSync(absPath)) return;
          watchedNewFiles.add(absPath);
          try {
            fs.watchFile(absPath, { interval: watchInterval }, (curr, prev) => {
              if (curr.mtimeMs === prev.mtimeMs) return;
              logWatcherInfo(
                reporter,
                'watcher.changed',
                `[fcc-source-challenges fs.watchFile] change ${filename}`
              );
              handleChallengeUpdate(filename, 'changed');
            });
            logWatcherInfo(
              reporter,
              'watcher.added',
              `[fcc-source-challenges fs.watch] new file detected ${filename}`
            );
            handleChallengeUpdate(filename, 'added');
            maybeTouchForNewBlock(filename);
          } catch (e) {
            logWatcherWarn(
              reporter,
              'watcher.error',
              `[fcc-source-challenges fs.watch] failed to attach: ${e.message}`
            );
          }
        }
      );
      logWatcherInfo(
        reporter,
        'watcher.ready',
        `[fcc-source-challenges fs.watch] recursive watcher armed on ${curriculumPath}`
      );
    } catch (e) {
      logWatcherWarn(
        reporter,
        'watcher.error',
        `[fcc-source-challenges fs.watch] failed to start recursive watcher: ${e.message}`
      );
    }
  }
  if (useNativeWatch) watchForNewFiles();

  function sourceAndCreateNodes() {
    return source()
      .then(challenges => Promise.all(challenges))
      .then(challenges => {
        // create challenge nodes
        challenges.forEach(challenge => {
          const newNode = reportNodeCreationToGatsby(challenge);
          const existingNodes =
            filepathToStatefullyCreatedNodes.get(challenge.sourceLocation) ||
            [];
          filepathToStatefullyCreatedNodes.set(challenge.sourceLocation, [
            ...existingNodes,
            newNode
          ]);
          idToFilepath.set(newNode.id, challenge.sourceLocation);
        });
        // create superblock structure nodes
        createSuperBlockStructureNodes();
        return Promise.resolve();
      })
      .catch(e => {
        console.log(e);
        reporter.panic(`fcc-source-challenges

  ${e.message}

  `);
      });
  }

  function reportNodeCreationToGatsby(challenge, options) {
    const challengeNode = createChallengeNode(challenge, reporter, options);

    createNode(challengeNode);
    return challengeNode;
  }

  function createSuperBlockStructureNodes() {
    Object.keys(superBlockToFilename).forEach(superBlock => {
      const filename = superBlockToFilename[superBlock] || superBlock;
      try {
        const structure = getSuperblockStructure(filename);

        const nodeId = createNodeId(`SuperBlockStructure-${superBlock}`);
        const nodeContent = JSON.stringify(structure);

        createNode({
          ...structure,
          superBlock,
          id: nodeId,
          parent: null,
          children: [],
          internal: {
            type: 'SuperBlockStructure',
            content: nodeContent,
            contentDigest: createContentDigest(structure)
          }
        });
      } catch (err) {
        reporter.warn(
          `Could not load structure for ${superBlock} (${filename}): ${err.message}`
        );
      }
    });
  }

  return new Promise((resolve, reject) => {
    watcher.on('ready', () => sourceAndCreateNodes().then(resolve, reject));
  });
};

const createIdToNextPathMap = nodes =>
  nodes.reduce((map, node, index) => {
    const nextNode = nodes[index + 1];
    const nextPath = nextNode ? nextNode.challenge.fields.slug : null;
    if (nextPath) map[node.id] = nextPath;
    return map;
  }, {});

const createIdToPrevPathMap = nodes =>
  nodes.reduce((map, node, index) => {
    const prevNode = nodes[index - 1];
    const prevPath = prevNode ? prevNode.challenge.fields.slug : null;
    if (prevPath) map[node.id] = prevPath;
    return map;
  }, {});

exports.createPagesStatefully = async function ({ graphql, actions }) {
  const result = await graphql(`
    {
      allChallengeNode(
        sort: [
          { challenge: { superOrder: ASC } }
          { challenge: { order: ASC } }
          { challenge: { challengeOrder: ASC } }
        ]
      ) {
        edges {
          node {
            id
            challenge {
              block
              blockLabel
              blockLayout
              certification
              challengeType
              dashedName
              demoType
              disableLoopProtectTests
              disableLoopProtectPreview
              fields {
                slug
                blockHashSlug
              }
              id
              isLastChallengeInBlock
              order
              required {
                link
                src
              }
              challengeOrder
              challengeFiles {
                name
                ext
                contents
                history
                fileKey
              }
              saveSubmissionToDB
              solutions {
                contents
                ext
                history
                fileKey
              }
              superBlock
              superOrder
              template
              usesMultifileEditor
              chapter
              module
            }
          }
        }
      }
    }
  `);

  allChallengeNodes = result.data.allChallengeNode.edges.map(
    ({ node }) => node
  );

  const idToNextPathCurrentCurriculum =
    createIdToNextPathMap(allChallengeNodes);
  const idToPrevPathCurrentCurriculum =
    createIdToPrevPathMap(allChallengeNodes);

  const nodeToPage = createChallengePages(actions.createPage, {
    idToNextPathCurrentCurriculum,
    idToPrevPathCurrentCurriculum
  });

  // Create challenge pages.
  allChallengeNodes.forEach(nodeToPage);
};

exports.createPages = function ({ actions }) {
  if (!allChallengeNodes) return;

  // actions.createPage has to be called in the createPages hook
  const newNodes = [...filePathToCreatedNodes.values()].flat();
  // Nodes need sorting so createChallengePages can find the first and last
  // challenges in a block.
  const sortedNodes = sortBy(
    [...allChallengeNodes, ...newNodes],
    ['challenge.superOrder', 'challenge.order', 'challenge.challengeOrder']
  );

  const idToNextPathCurrentCurriculum = createIdToNextPathMap(sortedNodes);
  const idToPrevPathCurrentCurriculum = createIdToPrevPathMap(sortedNodes);

  for (const node of newNodes) {
    const nodeToPage = createChallengePages(actions.createPage, {
      idToNextPathCurrentCurriculum,
      idToPrevPathCurrentCurriculum
    });

    nodeToPage(node, 0, sortedNodes);
  }

  // It's important NOT to clear the createdNodes, since Gatsby deletes any
  // pages that are not recreated each time createPages is called.
};
