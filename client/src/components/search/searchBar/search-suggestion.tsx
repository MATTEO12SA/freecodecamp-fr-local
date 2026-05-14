import React from 'react';
import { Highlight } from 'react-instantsearch';
import type { Hit } from './types';

interface SuggestionProps {
  hit: Hit;
  handleMouseEnter: (e: React.SyntheticEvent<HTMLElement, Event>) => void;
  handleMouseLeave: (e: React.SyntheticEvent<HTMLElement, Event>) => void;
}

const Suggestion = ({
  hit,
  handleMouseEnter,
  handleMouseLeave
}: SuggestionProps): JSX.Element => {
  return (
    <span
      className={'fcc_suggestion_item'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-disabled-external-link='true'
    >
      <span className='hit-name'>
        <Highlight attribute='title' hit={hit} />
      </span>
    </span>
  );
};

export default Suggestion;
