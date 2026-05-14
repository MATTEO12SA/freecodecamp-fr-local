import React from 'react';
import { useTranslation } from 'react-i18next';
import NoHitsSuggestion from './no-hits-suggestion';

interface SearchBarFooterProps {
  hasHits: boolean;
  query?: string;
  isSelected: boolean;
  onMouseEnter: (e: React.SyntheticEvent<HTMLElement, Event>) => void;
  onMouseLeave: (e: React.SyntheticEvent<HTMLElement, Event>) => void;
}

const SearchBarFooter = ({
  hasHits,
  query,
  isSelected,
  onMouseEnter,
  onMouseLeave
}: SearchBarFooterProps) => {
  const { t } = useTranslation();
  const title = t('search.no-results');

  if (!query) {
    return null;
  }

  return hasHits ? (
    <li
      className={`ais-Hits-item ${isSelected ? 'selected' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span
        className='fcc_suggestion_item'
        data-disabled-external-link='true'
      >
        <span className='hit-name'>
          {t('search.see-results', { searchQuery: query })}
        </span>
      </span>
    </li>
  ) : (
    <NoHitsSuggestion title={title} />
  );
};

export default SearchBarFooter;
