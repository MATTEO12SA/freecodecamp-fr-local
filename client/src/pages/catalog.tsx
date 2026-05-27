import { graphql } from 'gatsby';
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Spacer, Dropdown, MenuItem, Alert } from '@freecodecamp/ui';
import { catalog } from '@freecodecamp/shared/config/catalog';
import { challengeTypes } from '@freecodecamp/shared/config/challenge-types';
import CatalogItem from '../components/catalog-item';
import { hasFrenchIntro } from '../utils/has-french-intro';
import { getLocalCompletedChallenges } from '../utils/local-progress';

import './catalog.css';

const frenchTopic = 'french' as const;

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

function isLocalChallenge(challenge: CatalogChallenge): boolean {
  return (
    !UNSUPPORTED_LOCAL_BLOCKS.has(challenge.block) &&
    !UNSUPPORTED_LOCAL_CHALLENGE_TYPES.has(challenge.challengeType)
  );
}

const getCheckboxLabel = (filterLabel: string, optionLabel: string) =>
  `${filterLabel} ${optionLabel}`.replace(/\s+/g, ' ').trim();

const CatalogPage = ({ data }: { data?: CatalogPageData }) => {
  const { t } = useTranslation();

  const [selectedLevels, setSelectedLevels] = useState<string[]>(['all']);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>(
    []
  );

  useEffect(() => {
    setCompletedChallengeIds(getLocalCompletedChallenges().map(c => c.id));
  }, []);

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

  // Extract unique levels and topics from catalog
  const uniqueLevels = useMemo(() => {
    const levels = [...new Set(catalog.map(item => item.level))];
    return levels.sort();
  }, []);

  const uniqueTopics = useMemo(() => {
    const topics = [...new Set(catalog.map(item => item.topic))];
    return topics.sort();
  }, []);

  // Handle level filter change
  const handleLevelChange = (level: string) => {
    if (level === 'all') {
      setSelectedLevels(['all']);
    } else {
      setSelectedLevels(prev => {
        const filtered = prev.filter(l => l !== 'all');
        if (filtered.includes(level)) {
          const updated = filtered.filter(l => l !== level);
          return updated.length === 0 ? ['all'] : updated;
        } else {
          return [...filtered, level];
        }
      });
    }
  };

  // Handle topic filter change
  const handleTopicChange = (topic: string) => {
    if (topic === 'all') {
      setSelectedTopics(['all']);
    } else {
      setSelectedTopics(prev => {
        const filtered = prev.filter(t => t !== 'all');
        if (filtered.includes(topic)) {
          const updated = filtered.filter(t => t !== topic);
          return updated.length === 0 ? ['all'] : updated;
        } else {
          return [...filtered, topic];
        }
      });
    }
  };

  const filteredCatalog = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return catalog.filter(course => {
      const intro = t(`intro:${course.superBlock}`, {
        returnObjects: true
      }) as Partial<{
        title: string;
        summary: string[];
      }>;
      const title = intro.title || course.superBlock;
      const summary = Array.isArray(intro.summary) ? intro.summary : [];
      const hasFrenchContent = hasFrenchIntro(course.superBlock);
      const levelMatch =
        selectedLevels.includes('all') || selectedLevels.includes(course.level);
      const translatedMatch =
        selectedTopics.includes(frenchTopic) && hasFrenchContent;
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

  const getSelectionLabel = (selected: string[]) =>
    selected.includes('all')
      ? t('curriculum.catalog.all')
      : t('curriculum.catalog.selected-count', { count: selected.length });

  const levelFilterLabel = t('curriculum.catalog.filter-level');
  const topicFilterLabel = t('curriculum.catalog.filter-topic');

  return (
    <main>
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
            onChange={event => setSearchQuery(event.target.value)}
            placeholder={t('curriculum.catalog.search-placeholder')}
          />
        </div>
        <div className='catalog-filters'>
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
                <MenuItem key={level} onClick={() => handleLevelChange(level)}>
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
                <MenuItem key={topic} onClick={() => handleTopicChange(topic)}>
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
      <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
        {filteredCatalog.length === 0 ? (
          <Alert variant='info'>{t('curriculum.catalog.no-results')}</Alert>
        ) : (
          <section className='catalog-wrap'>
            {filteredCatalog.map(course => {
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

              return (
                <CatalogItem
                  key={superBlock}
                  superBlock={superBlock}
                  level={level}
                  hours={hours}
                  topic={topic}
                  showAllSummaries={true}
                  completedCount={completedCount}
                  totalCount={courseChallenges.length}
                  actionHref={firstUnfinished?.fields.slug}
                  actionLabel={t(
                    hasStarted
                      ? 'curriculum.catalog.continue'
                      : 'curriculum.catalog.start'
                  )}
                />
              );
            })}
          </section>
        )}
      </Col>
      <Spacer size='l' />
    </main>
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
