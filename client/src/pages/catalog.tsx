import { graphql, navigate } from 'gatsby';
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Spacer, Dropdown, MenuItem, Alert } from '@freecodecamp/ui';
import { catalog } from '@freecodecamp/shared/config/catalog';
import { challengeTypes } from '@freecodecamp/shared/config/challenge-types';
import englishIntro from '../../i18n/locales/english/intro.json';
import CatalogItem from '../components/catalog-item';
import SEO from '../components/seo';
import {
  getFrenchFileCoverage,
  hasFrenchIntro
} from '../utils/has-french-intro';
import { getLocalCompletedChallenges } from '../utils/local-progress';
import {
  getCatalogHref,
  parseCatalogFilters,
  toggleCatalogSelection
} from '../utils/catalog-filters';
import { getCatalogTranslationStatus } from '../utils/catalog-translation-status';

import './catalog.css';

const frenchTopic = 'french' as const;
const uniqueLevels = [...new Set(catalog.map(item => item.level))].sort();
const uniqueTopics = [...new Set(catalog.map(item => item.topic))].sort();
const selectableTopics = [frenchTopic, ...uniqueTopics];
export const CATALOG_PAGE_SIZE = 12;

export const hasFrenchCatalogIntro = hasFrenchIntro;

type CatalogChallenge = {
  id: string;
  block: string;
  challengeType: number;
  order: number;
  challengeOrder: number;
  superBlock: string;
  fields: { slug: string };
};

type CatalogChallengeNode = { challenge: CatalogChallenge };
type CatalogIntro = { title?: string; intro?: string[]; summary?: string[] };

type CatalogPageData = {
  allChallengeNode?: { nodes: CatalogChallengeNode[] };
};

const UNSUPPORTED_LOCAL_BLOCKS = new Set<string>([
  'daily-coding-challenges-javascript',
  'daily-coding-challenges-python'
]);

const UNSUPPORTED_LOCAL_CHALLENGE_TYPES = new Set<number>([
  challengeTypes.backEndProject,
  challengeTypes.pythonProject,
  challengeTypes.codeAllyPractice,
  challengeTypes.codeAllyCert,
  challengeTypes.theOdinProject,
  challengeTypes.colab,
  challengeTypes.msTrophy,
  challengeTypes.dailyChallengeJs,
  challengeTypes.dailyChallengePy
]);

const englishCatalogIntro = englishIntro as unknown as Record<
  string,
  CatalogIntro
>;

function isLocalChallenge(challenge: CatalogChallenge): boolean {
  return (
    !UNSUPPORTED_LOCAL_BLOCKS.has(challenge.block) &&
    !UNSUPPORTED_LOCAL_CHALLENGE_TYPES.has(challenge.challengeType)
  );
}

const getCheckboxLabel = (filterLabel: string, optionLabel: string) =>
  `${filterLabel} ${optionLabel}`.replace(/\s+/g, ' ').trim();

const CatalogPage = ({
  data,
  location
}: {
  data?: CatalogPageData;
  location?: { search: string };
}) => {
  const { t } = useTranslation();
  const initialFilters = parseCatalogFilters(
    location?.search || '',
    uniqueLevels,
    selectableTopics
  );

  const [selectedLevels, setSelectedLevels] = useState<string[]>(
    initialFilters.levels
  );
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    initialFilters.topics
  );
  const [searchQuery, setSearchQuery] = useState(initialFilters.query);
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>(
    []
  );
  const [visibleCount, setVisibleCount] = useState(CATALOG_PAGE_SIZE);

  useEffect(() => {
    setCompletedChallengeIds(getLocalCompletedChallenges().map(c => c.id));
  }, []);

  useEffect(() => {
    const filters = parseCatalogFilters(
      location?.search || '',
      uniqueLevels,
      selectableTopics
    );
    setSearchQuery(filters.query);
    setSelectedLevels(filters.levels);
    setSelectedTopics(filters.topics);
  }, [location?.search]);

  const completedSet = useMemo(
    () => new Set(completedChallengeIds),
    [completedChallengeIds]
  );

  const challengesBySuperBlock = useMemo(() => {
    const map = new Map<string, CatalogChallenge[]>();
    const nodes = data?.allChallengeNode?.nodes || [];
    for (const { challenge } of nodes) {
      if (!isLocalChallenge(challenge)) continue;
      const list = map.get(challenge.superBlock) || [];
      list.push(challenge);
      map.set(challenge.superBlock, list);
    }
    return map;
  }, [data?.allChallengeNode?.nodes]);

  const persistFilters = (
    filters: {
      query: string;
      levels: string[];
      topics: string[];
    },
    replace = false
  ) => {
    void navigate(getCatalogHref(filters), { replace });
  };

  // Handle level filter change
  const handleLevelChange = (level: string) => {
    const levels = toggleCatalogSelection(selectedLevels, level);
    setSelectedLevels(levels);
    persistFilters({
      query: searchQuery,
      levels,
      topics: selectedTopics
    });
  };

  // Handle topic filter change
  const handleTopicChange = (topic: string) => {
    const topics = toggleCatalogSelection(selectedTopics, topic);
    setSelectedTopics(topics);
    persistFilters({
      query: searchQuery,
      levels: selectedLevels,
      topics
    });
  };

  const filteredCatalog = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return catalog.filter(course => {
      const intro = t(`intro:${course.superBlock}`, {
        returnObjects: true
      }) as Partial<{
        title: string;
        intro: string[];
        summary: string[];
      }>;
      const englishCourseIntro = englishCatalogIntro[course.superBlock] || {};
      const title = intro.title || course.superBlock;
      const summary = Array.isArray(intro.summary) ? intro.summary : [];
      const coverage = getFrenchFileCoverage(course.superBlock);
      const translationStatus = getCatalogTranslationStatus({
        translatedFiles: coverage.translated,
        totalFiles: coverage.total,
        frenchIntro: intro,
        englishIntro: englishCourseIntro
      });
      const levelMatch =
        selectedLevels.includes('all') || selectedLevels.includes(course.level);
      const translatedMatch =
        selectedTopics.includes(frenchTopic) && translationStatus !== 'absent';
      const topicMatch =
        selectedTopics.includes('all') ||
        selectedTopics.includes(course.topic) ||
        translatedMatch;
      const searchable = [
        course.superBlock,
        course.level,
        course.topic,
        title,
        ...summary,
        t(`curriculum.catalog.levels.${course.level}`),
        t(`curriculum.catalog.topic.${course.topic}`)
      ]
        .join(' ')
        .toLowerCase();
      const searchMatch =
        normalizedSearch.length === 0 || searchable.includes(normalizedSearch);
      return levelMatch && topicMatch && searchMatch;
    });
  }, [searchQuery, selectedLevels, selectedTopics, t]);

  useEffect(() => {
    setVisibleCount(CATALOG_PAGE_SIZE);
  }, [searchQuery, selectedLevels, selectedTopics]);

  const visibleCatalog = filteredCatalog.slice(0, visibleCount);
  const hasMoreResults = visibleCount < filteredCatalog.length;

  const restoreDropdownFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape') return;

    const target = event.target as HTMLElement;
    const menu = target.closest('[role="menu"]');
    const toggle = menu
      ?.closest('.dropdown')
      ?.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]');

    window.setTimeout(() => toggle?.focus(), 0);
  };

  const getSelectionLabel = (selected: string[]) =>
    selected.includes('all')
      ? t('curriculum.catalog.all')
      : t('curriculum.catalog.selected-count', { count: selected.length });

  const levelFilterLabel = t('curriculum.catalog.filter-level');
  const topicFilterLabel = t('curriculum.catalog.filter-topic');

  return (
    <>
      <SEO title={t('curriculum.catalog.title')} />
      <main id='content-start' tabIndex={-1}>
        <Spacer size='l' />
        <h1 className='text-center'>{t('curriculum.catalog.title')}</h1>
        <Spacer size='l' />

        <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
          <div className='catalog-search'>
            <label htmlFor='catalog-search-input'>
              {t('curriculum.catalog.search-label')}
            </label>
            <input
              id='catalog-search-input'
              type='search'
              value={searchQuery}
              onChange={event => {
                const query = event.target.value;
                setSearchQuery(query);
                persistFilters(
                  {
                    query,
                    levels: selectedLevels,
                    topics: selectedTopics
                  },
                  true
                );
              }}
              placeholder={t('curriculum.catalog.search-placeholder')}
            />
          </div>
          <div
            className='catalog-filters'
            onKeyDownCapture={restoreDropdownFocus}
          >
            <Dropdown block={true}>
              <Dropdown.Toggle id='level-filter-dropdown'>
                {levelFilterLabel} {getSelectionLabel(selectedLevels)}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <MenuItem onClick={() => handleLevelChange('all')}>
                  <input
                    type='checkbox'
                    checked={selectedLevels.includes('all')}
                    aria-label={getCheckboxLabel(
                      levelFilterLabel,
                      t('curriculum.catalog.all')
                    )}
                    title={getCheckboxLabel(
                      levelFilterLabel,
                      t('curriculum.catalog.all')
                    )}
                    onChange={() => {}}
                    className='filter-checkbox'
                  />
                  {t('curriculum.catalog.all')}
                </MenuItem>
                {uniqueLevels.map(level => (
                  <MenuItem
                    key={level}
                    onClick={() => handleLevelChange(level)}
                  >
                    <input
                      type='checkbox'
                      checked={selectedLevels.includes(level)}
                      aria-label={getCheckboxLabel(
                        levelFilterLabel,
                        t(`curriculum.catalog.levels.${level}`)
                      )}
                      title={getCheckboxLabel(
                        levelFilterLabel,
                        t(`curriculum.catalog.levels.${level}`)
                      )}
                      onChange={() => {}}
                      className='filter-checkbox'
                    />
                    {t(`curriculum.catalog.levels.${level}`)}
                  </MenuItem>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown block={true}>
              <Dropdown.Toggle id='topic-filter-dropdown'>
                {topicFilterLabel} {getSelectionLabel(selectedTopics)}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <MenuItem onClick={() => handleTopicChange('all')}>
                  <input
                    type='checkbox'
                    checked={selectedTopics.includes('all')}
                    aria-label={getCheckboxLabel(
                      topicFilterLabel,
                      t('curriculum.catalog.all')
                    )}
                    title={getCheckboxLabel(
                      topicFilterLabel,
                      t('curriculum.catalog.all')
                    )}
                    onChange={() => {}}
                    className='filter-checkbox'
                  />
                  {t('curriculum.catalog.all')}
                </MenuItem>
                <MenuItem onClick={() => handleTopicChange(frenchTopic)}>
                  <input
                    type='checkbox'
                    checked={selectedTopics.includes(frenchTopic)}
                    aria-label={getCheckboxLabel(
                      topicFilterLabel,
                      t('curriculum.catalog.topic.french')
                    )}
                    title={getCheckboxLabel(
                      topicFilterLabel,
                      t('curriculum.catalog.topic.french')
                    )}
                    onChange={() => {}}
                    className='filter-checkbox'
                  />
                  {t('curriculum.catalog.topic.french')}
                </MenuItem>
                {uniqueTopics.map(topic => (
                  <MenuItem
                    key={topic}
                    onClick={() => handleTopicChange(topic)}
                  >
                    <input
                      type='checkbox'
                      checked={selectedTopics.includes(topic)}
                      aria-label={getCheckboxLabel(
                        topicFilterLabel,
                        t(`curriculum.catalog.topic.${topic}`)
                      )}
                      title={getCheckboxLabel(
                        topicFilterLabel,
                        t(`curriculum.catalog.topic.${topic}`)
                      )}
                      onChange={() => {}}
                      className='filter-checkbox'
                    />
                    {t(`curriculum.catalog.topic.${topic}`)}
                  </MenuItem>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Col>
        <Spacer size='m' />
        <Col md={12} sm={12} xs={12}>
          {filteredCatalog.length === 0 ? (
            <Alert variant='info'>{t('curriculum.catalog.no-results')}</Alert>
          ) : (
            <>
              <p className='catalog-results-count' role='status'>
                {t('curriculum.catalog.results-count', {
                  shown: visibleCatalog.length,
                  total: filteredCatalog.length
                })}
              </p>
              <section className='catalog-wrap'>
                {visibleCatalog.map(course => {
                  const { superBlock, level, hours, topic } = course;
                  const courseChallenges =
                    challengesBySuperBlock.get(superBlock) || [];
                  const completedCount = courseChallenges.filter(challenge =>
                    completedSet.has(challenge.id)
                  ).length;
                  const firstUnfinished = courseChallenges.find(
                    challenge => !completedSet.has(challenge.id)
                  );
                  const hasStarted = completedCount > 0;
                  const frenchIntro = t(`intro:${superBlock}`, {
                    returnObjects: true
                  }) as Partial<{
                    title: string;
                    intro: string[];
                    summary: string[];
                  }>;
                  const englishCourseIntro =
                    englishCatalogIntro[superBlock] || {};
                  const coverage = getFrenchFileCoverage(superBlock);
                  const translationStatus = getCatalogTranslationStatus({
                    translatedFiles: coverage.translated,
                    totalFiles: coverage.total,
                    frenchIntro,
                    englishIntro: englishCourseIntro
                  });

                  return (
                    <CatalogItem
                      key={superBlock}
                      superBlock={superBlock}
                      level={level}
                      hours={hours}
                      topic={topic}
                      completedCount={completedCount}
                      totalCount={courseChallenges.length}
                      actionHref={firstUnfinished?.fields.slug}
                      actionLabel={t(
                        hasStarted
                          ? 'curriculum.catalog.continue'
                          : 'curriculum.catalog.start'
                      )}
                      translationStatus={translationStatus}
                      translatedFiles={coverage.translated}
                      totalFiles={coverage.total}
                    />
                  );
                })}
              </section>
              <div className='catalog-pagination'>
                {hasMoreResults && (
                  <button
                    className='btn btn-primary'
                    type='button'
                    onClick={() =>
                      setVisibleCount(count => count + CATALOG_PAGE_SIZE)
                    }
                  >
                    {t('curriculum.catalog.show-more')}
                  </button>
                )}
                {visibleCount > CATALOG_PAGE_SIZE && (
                  <a className='btn btn-secondary' href='#content-start'>
                    {t('curriculum.catalog.back-to-top')}
                  </a>
                )}
              </div>
            </>
          )}
        </Col>
        <Spacer size='l' />
      </main>
    </>
  );
};

export default CatalogPage;

export const query = graphql`
  query CatalogPageQuery {
    allChallengeNode(
      sort: [
        { challenge: { superOrder: ASC } }
        { challenge: { order: ASC } }
        { challenge: { challengeOrder: ASC } }
      ]
    ) {
      nodes {
        challenge {
          id
          block
          challengeType
          order
          challengeOrder
          superBlock
          fields {
            slug
          }
        }
      }
    }
  }
`;
