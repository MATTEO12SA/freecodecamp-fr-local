import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faStairs } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { Link } from './helpers';
import type { CatalogTranslationStatus } from '../utils/catalog-translation-status';

interface CatalogItemProps {
  superBlock: string;
  level: string;
  hours: number;
  topic: string;
  showAllSummaries?: boolean;
  completedCount?: number;
  totalCount?: number;
  actionHref?: string;
  actionLabel?: string;
  translationStatus?: CatalogTranslationStatus;
  translatedFiles?: number;
  totalFiles?: number;
}

const CatalogItem: React.FC<CatalogItemProps> = ({
  superBlock,
  level,
  hours,
  topic,
  showAllSummaries = false,
  completedCount = 0,
  totalCount = 0,
  actionHref,
  actionLabel,
  translationStatus,
  translatedFiles = 0,
  totalFiles = 0
}) => {
  const { t } = useTranslation();

  const intro = t(`intro:${superBlock}`, {
    returnObjects: true
  }) as Partial<{
    title: string;
    intro: string[];
    summary: string[];
  }>;
  const title = intro.title || superBlock;
  const introBody = Array.isArray(intro.intro)
    ? intro.intro
    : Array.isArray(intro.summary)
      ? intro.summary
      : [];
  const summary =
    translationStatus === 'partial'
      ? [t('curriculum.catalog.partial-summary')]
      : introBody;
  const coveragePercent =
    totalFiles > 0 ? Math.round((translatedFiles / totalFiles) * 100) : 0;

  const duration =
    hours === 1
      ? t('curriculum.catalog.duration-singular', { duration: hours })
      : t('curriculum.catalog.duration', { duration: hours });

  const badgeLabel =
    translationStatus === 'complete'
      ? t('curriculum.catalog.badge-complete', { percent: coveragePercent })
      : translationStatus === 'partial'
        ? t('curriculum.catalog.badge-partial', { percent: coveragePercent })
        : translationStatus === 'absent'
          ? t('curriculum.catalog.badge-absent')
          : null;

  return (
    <article className='catalog-item'>
      <div className='catalog-item-top'>
        <div className='catalog-item-labels'>
          <div className={`block-label block-label-${topic}`}>
            {t(`curriculum.catalog.topic.${topic}`)}
          </div>
          {badgeLabel && (
            <div
              className={`catalog-item-translation-status catalog-item-translation-status--${translationStatus}`}
            >
              {badgeLabel}
            </div>
          )}
        </div>
        <h2>
          <Link to={`/learn/${superBlock}`}>{title}</Link>
        </h2>
        {showAllSummaries ? (
          summary.map((text, i) => <p key={i}>{text}</p>)
        ) : summary && summary.length > 0 ? (
          <p>{summary[0]}</p>
        ) : null}
      </div>
      <div className='catalog-item-bottom'>
        <div>
          <FontAwesomeIcon icon={faStairs} />
          &nbsp; {t(`curriculum.catalog.levels.${level}`)}
        </div>
        <div>
          <FontAwesomeIcon icon={faClock} />
          &nbsp; {duration}
        </div>
      </div>
      {totalCount > 0 && (
        <p className='catalog-item-progress'>
          {t('curriculum.catalog.progress', {
            completed: completedCount,
            total: totalCount
          })}
        </p>
      )}
      <Link
        className='catalog-item-cta'
        to={actionHref || `/learn/${superBlock}`}
      >
        {actionLabel || t('curriculum.catalog.start')}
      </Link>
    </article>
  );
};

export default CatalogItem;
