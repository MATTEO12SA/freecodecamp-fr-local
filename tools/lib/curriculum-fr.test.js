'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  isLabelTranslated,
  completenessPercent,
  getSuperblockTranslationReport,
  collectIntroLabelPairs,
  applyIntroCopies
} = require('./curriculum-fr');

test('isLabelTranslated treats identical prose as leftover English', () => {
  assert.equal(
    isLabelTranslated(
      'Introduction to Dates in JavaScript',
      'Introduction to Dates in JavaScript'
    ),
    false
  );
});

test('isLabelTranslated accepts a real French label', () => {
  assert.equal(
    isLabelTranslated(
      'Introduction aux dates en JavaScript',
      'Introduction to Dates in JavaScript'
    ),
    true
  );
});

test('isLabelTranslated allows identical single-token names', () => {
  assert.equal(isLabelTranslated('Python', 'Python'), true);
  assert.equal(isLabelTranslated('JavaScript', 'JavaScript'), true);
});

test('completenessPercent never rounds leftover labels up to 100', () => {
  assert.equal(
    completenessPercent({
      filesTranslated: 1311,
      filesTotal: 1311,
      introsTranslated: 184,
      introsTotal: 190,
      titlesTranslated: 1311,
      titlesTotal: 1311
    }),
    99
  );
  assert.equal(
    completenessPercent({
      filesTranslated: 1311,
      filesTotal: 1311,
      introsTranslated: 190,
      introsTotal: 190,
      titlesTranslated: 1311,
      titlesTotal: 1311
    }),
    100
  );
  assert.equal(
    completenessPercent({
      filesTranslated: 12,
      filesTotal: 527,
      introsTranslated: 0,
      introsTotal: 10,
      titlesTranslated: 0,
      titlesTotal: 12
    }),
    2
  );
  assert.equal(
    completenessPercent({
      filesTranslated: 48,
      filesTotal: 48,
      introsTranslated: 20,
      introsTotal: 20,
      titlesTranslated: 47,
      titlesTotal: 48
    }),
    99
  );
});

test('javascript-v9 is complete only if files and intro copies are French', () => {
  const report = getSuperblockTranslationReport('javascript-v9', {
    includeTitles: false
  });
  assert.equal(report.filesTranslated, report.filesTotal);
  assert.equal(report.filesTotal, 1311);
  const leftoverPaths = report.introLeftovers.map(item => item.path);
  assert.deepEqual(
    leftoverPaths,
    [],
    `intro leftovers still English:\n${leftoverPaths.join('\n')}`
  );
  assert.equal(report.complete, true);
  assert.equal(report.pct, 100);
});

test('python-v9 is not 100% while files and labels remain English', () => {
  const report = getSuperblockTranslationReport('python-v9', {
    includeTitles: false
  });
  assert.equal(report.complete, false);
  assert.ok(report.pct < 100);
  const leftovers = collectIntroLabelPairs('python-v9');
  assert.ok(leftovers.some(item => !item.translated));
});

test('applyIntroCopies copies existing French onto leftover standalone blocks', () => {
  const frenchIntro = {
    'python-v9': {
      blocks: {
        'lecture-introduction-to-python': {
          title: 'Introduction à Python',
          intro: ['Dans ces lectures, tu découvriras Python.']
        }
      }
    },
    'introduction-to-python-basics': {
      blocks: {
        'lecture-introduction-to-python': {
          title: 'Introduction to Python',
          intro: ['In these lectures, you will learn about Python.']
        }
      }
    }
  };
  const englishIntro = {
    'python-v9': {
      blocks: {
        'lecture-introduction-to-python': {
          title: 'Introduction to Python',
          intro: ['In these lectures, you will learn about Python.']
        }
      }
    },
    'introduction-to-python-basics': {
      blocks: {
        'lecture-introduction-to-python': {
          title: 'Introduction to Python',
          intro: ['In these lectures, you will learn about Python.']
        }
      }
    }
  };

  const { changes } = applyIntroCopies(
    frenchIntro,
    englishIntro,
    'python-v9',
    new Set(['lecture-introduction-to-python'])
  );

  assert.equal(changes.length, 2);
  assert.equal(
    frenchIntro['introduction-to-python-basics'].blocks[
      'lecture-introduction-to-python'
    ].title,
    'Introduction à Python'
  );
  assert.equal(
    applyIntroCopies(
      frenchIntro,
      englishIntro,
      'python-v9',
      new Set(['lecture-introduction-to-python'])
    ).changes.length,
    0
  );
});

test('applyIntroCopies never invents a translation', () => {
  const frenchIntro = {
    'python-v9': {
      blocks: {
        'lecture-introduction-to-python': {
          title: 'Introduction to Python',
          intro: ['In these lectures, you will learn about Python.']
        }
      }
    },
    'introduction-to-python-basics': {
      blocks: {
        'lecture-introduction-to-python': {
          title: 'Introduction to Python',
          intro: ['In these lectures, you will learn about Python.']
        }
      }
    }
  };
  const englishIntro = JSON.parse(JSON.stringify(frenchIntro));
  const { changes } = applyIntroCopies(
    frenchIntro,
    englishIntro,
    'python-v9',
    new Set(['lecture-introduction-to-python'])
  );
  assert.equal(changes.length, 0);
});

test('object FR module labels still count against a string EN module title', () => {
  const report = getSuperblockTranslationReport('javascript-v9', {
    includeTitles: false
  });
  assert.equal(
    report.introLeftovers.some(
      item =>
        item.path === 'javascript-v9.modules.lab-markdown-to-html-converter'
    ),
    false
  );
});

test('shipped v9 certs are complete only with files, intros and titles', () => {
  for (const key of [
    'javascript-v9',
    'responsive-web-design-v9',
    'front-end-development-libraries-v9',
    'back-end-development-and-apis-v9'
  ]) {
    const report = getSuperblockTranslationReport(key, { includeTitles: true });
    assert.equal(
      report.complete,
      true,
      `${key} leftover intros:\n${report.introLeftovers.map(i => i.path).join('\n')}`
    );
    assert.equal(report.pct, 100, key);
  }
});
