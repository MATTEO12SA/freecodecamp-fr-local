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

  test('lists v9 certifications including French-translated ones', () => {
    render(<CatalogPage />);
    const items = screen
      .getAllByTestId('catalog-item')
      .map(item => item.textContent);
    expect(items).toEqual(
      expect.arrayContaining([
        'responsive-web-design-v9',
        'javascript-v9',
        'front-end-development-libraries-v9',
        'back-end-development-and-apis-v9'
      ])
    );
    expect(items.length).toBeLessThanOrEqual(CATALOG_PAGE_SIZE);
    expect(items.length).toBe(catalog.length);
  });

  test('renders French and other certification sections', () => {
    render(<CatalogPage />);
    expect(
      screen.getByRole('heading', {
        name: 'curriculum.catalog.french-section'
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'curriculum.catalog.other-section'
      })
    ).toBeInTheDocument();
  });

  test('visible catalog items link to their superblock learn pages', () => {
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
    expect(items.length).toBeGreaterThan(0);
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
