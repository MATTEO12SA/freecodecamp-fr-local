import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { catalog } from '@freecodecamp/shared/config/catalog';
import CatalogPage, {
  CATALOG_PAGE_SIZE,
  hasFrenchCatalogIntro
} from './catalog';

vi.mock('../utils/has-french-intro');

vi.mock('../components/seo', () => ({
  default: ({ title }: { title: string }) => (
    <span data-testid='catalog-seo'>{title}</span>
  )
}));

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
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'curriculum.catalog.title'
      })
    ).toBeInTheDocument();
    expect(screen.getByTestId('catalog-seo')).toHaveTextContent(
      'curriculum.catalog.title'
    );
    expect(screen.getByRole('main')).toHaveAttribute('id', 'content-start');
  });

  test('renders the first catalog page and progressively reveals more', () => {
    render(<CatalogPage />);
    expect(screen.getAllByTestId('catalog-item')).toHaveLength(
      CATALOG_PAGE_SIZE
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'curriculum.catalog.show-more'
      })
    );

    expect(screen.getAllByTestId('catalog-item')).toHaveLength(
      CATALOG_PAGE_SIZE * 2
    );
    expect(
      screen.getByRole('link', { name: 'curriculum.catalog.back-to-top' })
    ).toHaveAttribute('href', '#content-start');
  });

  test('visible catalog items link to their superblock learn pages', () => {
    render(<CatalogPage />);
    for (const course of catalog.slice(0, CATALOG_PAGE_SIZE)) {
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

  test('restores focus to a filter toggle after Escape', async () => {
    render(<CatalogPage />);

    const toggle = screen.getByText(/curriculum.catalog.filter-topic/);
    fireEvent.click(toggle);
    const menu = screen.getByRole('menu');
    const frenchOption = screen.getByText('curriculum.catalog.topic.french');
    frenchOption.focus();

    fireEvent.keyDown(menu, { key: 'Escape' });

    await waitFor(() => expect(toggle).toHaveFocus());
  });

  test('filters the catalog with search text', () => {
    render(<CatalogPage />);

    fireEvent.change(screen.getByLabelText('curriculum.catalog.search-label'), {
      target: { value: catalog[0].superBlock }
    });

    const items = screen
      .getAllByTestId('catalog-item')
      .map(item => item.textContent);

    expect(items).toEqual([catalog[0].superBlock]);
  });
});
