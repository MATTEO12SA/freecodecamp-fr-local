import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faStairs } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { Link } from './helpers';

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
  actionLabel
}) => {
  const { t } = useTranslation();

  const intro = t(`intro:${superBlock}`, {
    returnObjects: true
  }) as Partial<{
    title: string;
    summary: string[];
  }>;
  const title = intro.title || superBlock;
  const summary = Array.isArray(intro.summary) ? intro.summary : [];

  const duration =
    hours === 1
      ? t('curriculum.catalog.duration-singular', { duration: hours })
      : t('curriculum.catalog.duration', { duration: hours });

  return (
    <article className='catalog-item'>
      <div className='catalog-item-top'>
        <div className='catalog-item-labels'>
          <div className={`block-label block-label-${topic}`}>
            {t(`curriculum.catalog.topic.${topic}`)}
          </div>
        </div>
        <h3>
          <Link to={`/learn/${superBlock}`}>{title}</Link>
        </h3>
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
