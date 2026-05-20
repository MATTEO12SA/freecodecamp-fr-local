import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { catalog } from '@freecodecamp/shared/config/catalog';
import CatalogPage, { hasFrenchCatalogIntro } from './catalog';

vi.mock('../components/catalog-item', () => ({
  default: ({ superBlock }: { superBlock: string }) => (
    <a data-testid='catalog-item' href={`/learn/${superBlock}`}>
      {superBlock}
    </a>
  )
}));

describe('CatalogPage', () => {
  test('renders the catalog page title', () => {
    render(<CatalogPage />);
    expect(screen.getByText('curriculum.catalog.title')).toBeInTheDocument();
  });

  test('renders a catalog item for each entry', () => {
    render(<CatalogPage />);
    const items = screen.getAllByTestId('catalog-item');
    expect(items).toHaveLength(catalog.length);
  });

  test('catalog items link to their superblock learn pages', () => {
    render(<CatalogPage />);
    for (const course of catalog) {
      const item = screen.getByRole('link', { name: course.superBlock });
      expect(item).toHaveAttribute('href', `/learn/${course.superBlock}`);
    }
  });

  test('renders level and topic filter dropdowns', () => {
    render(<CatalogPage />);
    expect(
      screen.getByText(/curriculum.catalog.filter-level/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/curriculum.catalog.filter-topic/)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText(/curriculum.catalog.filter-topic/));

    expect(
      screen.getByText('curriculum.catalog.topic.french')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'curriculum.catalog.filter-topic curriculum.catalog.topic.french'
      })
    ).toBeInTheDocument();
  });

  test('filters the catalog to French-translated entries', () => {
    render(<CatalogPage />);

    fireEvent.click(screen.getByText(/curriculum.catalog.filter-topic/));
    fireEvent.click(screen.getByText('curriculum.catalog.topic.french'));

    const expectedCourses = catalog
      .filter(course => hasFrenchCatalogIntro(course.superBlock))
      .map(course => course.superBlock);
    const items = screen
      .getAllByTestId('catalog-item')
      .map(item => item.textContent);

    expect(items).toEqual(expectedCourses);
  });
});
