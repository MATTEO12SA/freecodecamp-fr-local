import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Spacer, Dropdown, MenuItem, Alert } from '@freecodecamp/ui';
import { catalog } from '@freecodecamp/shared/config/catalog';
import englishIntro from '../../i18n/locales/english/intro.json';
import frenchIntro from '../../i18n/locales/french/intro.json';
import CatalogItem from '../components/catalog-item';

import './catalog.css';

const frenchTopic = 'french' as const;

type CatalogIntro = Record<string, unknown>;

const getCatalogIntroSignature = (intros: CatalogIntro, superBlock: string) => {
  const intro = intros[superBlock];
  const courseIntro =
    intro && typeof intro === 'object'
      ? (intro as { title?: unknown; summary?: unknown })
      : {};

  return JSON.stringify({
    title:
      typeof courseIntro.title === 'string' ? courseIntro.title : undefined,
    summary: Array.isArray(courseIntro.summary)
      ? courseIntro.summary
      : undefined
  });
};

export const hasFrenchCatalogIntro = (superBlock: string) =>
  getCatalogIntroSignature(frenchIntro, superBlock) !==
  getCatalogIntroSignature(englishIntro, superBlock);

const getCheckboxLabel = (filterLabel: string, optionLabel: string) =>
  `${filterLabel} ${optionLabel}`.replace(/\s+/g, ' ').trim();

const CatalogPage = () => {
  const { t } = useTranslation();

  const [selectedLevels, setSelectedLevels] = useState<string[]>(['all']);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['all']);

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
    return catalog.filter(course => {
      const levelMatch =
        selectedLevels.includes('all') || selectedLevels.includes(course.level);
      const translatedMatch =
        selectedTopics.includes(frenchTopic) &&
        hasFrenchCatalogIntro(course.superBlock);
      const topicMatch =
        selectedTopics.includes('all') ||
        selectedTopics.includes(course.topic) ||
        translatedMatch;
      return levelMatch && topicMatch;
    });
  }, [selectedLevels, selectedTopics]);

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

              return (
                <CatalogItem
                  key={superBlock}
                  superBlock={superBlock}
                  level={level}
                  hours={hours}
                  topic={topic}
                  showAllSummaries={true}
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
