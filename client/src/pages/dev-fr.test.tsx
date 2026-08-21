import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import DevFrPage from './dev-fr';

vi.mock('../components/seo', () => ({
  default: ({ title }: { title: string }) => (
    <span data-testid='dev-fr-seo'>{title}</span>
  )
}));

vi.mock('../utils/has-french-intro', () => ({
  hasFrenchIntro: (key: string) =>
    key === 'responsive-web-design-v9' || key === 'javascript-v9',
  getFrenchFileCoverage: (key: string) =>
    key === 'responsive-web-design-v9'
      ? { translated: 100, total: 100 }
      : key === 'javascript-v9'
        ? { translated: 50, total: 100 }
        : { translated: 0, total: 10 }
}));

describe('DevFrPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes('/local-dev/report.json')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              generatedAt: '2020-01-01T00:00:00.000Z',
              server: {
                url: 'http://localhost:8000',
                reportedStatus: 'ERROR',
                message: 'stale',
                mode: 'fast',
                runId: 'stale',
                startedAt: '',
                updatedAt: '',
                verdict: 'ERROR',
                http: { ok: false, statusCode: 0 }
              },
              translations: [
                {
                  key: 'javascript-v9',
                  translated: 1,
                  total: 100,
                  pct: 1,
                  translatedFiles: 1,
                  totalFiles: 100,
                  pctFiles: 1
                }
              ],
              drift: {
                blocks: 0,
                comparedFiles: 0,
                missingEnglish: 0,
                drifted: []
              },
              git: {
                branch: 'main',
                lastCommit: 'abc',
                dirty: false,
                changedFiles: []
              },
              latestLog: []
            })
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({})
        };
      })
    );
  });

  test('shows live HTTP UP even when snapshot says ERROR', async () => {
    render(<DevFrPage />);

    await waitFor(() => {
      expect(screen.getByText('UP')).toBeInTheDocument();
    });
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(
      screen.queryByText('Snapshot optionnel introuvable')
    ).not.toBeInTheDocument();
  });

  test('uses live preval coverage, not stale snapshot translations', async () => {
    render(<DevFrPage />);

    await waitFor(() => {
      expect(screen.getByText('responsive-web-design-v9')).toBeInTheDocument();
    });
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.queryByText('1%')).not.toBeInTheDocument();
    expect(
      screen.getByText(/Compteurs live depuis le disque/)
    ).toBeInTheDocument();
  });

  test('keeps GraphiQL behind the debug toggle', async () => {
    render(<DevFrPage />);

    expect(screen.queryByText('/___graphql')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Afficher debug' }));
    expect(screen.getByText('/___graphql')).toBeInTheDocument();
  });
});
