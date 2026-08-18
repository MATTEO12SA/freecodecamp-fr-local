export type CatalogFilters = {
  query: string;
  levels: string[];
  topics: string[];
};

function parseSelection(
  value: string | null,
  allowedValues: readonly string[]
): string[] {
  if (!value) return ['all'];

  const allowed = new Set(allowedValues);
  const selected = [
    ...new Set(
      value
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== 'all' && allowed.has(item))
    )
  ];

  return selected.length > 0 ? selected : ['all'];
}

export function parseCatalogFilters(
  search: string,
  levels: readonly string[],
  topics: readonly string[]
): CatalogFilters {
  const params = new URLSearchParams(search);
  return {
    query: params.get('q') || '',
    levels: parseSelection(params.get('level'), levels),
    topics: parseSelection(params.get('topic'), topics)
  };
}

export function getCatalogHref(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  const query = filters.query.trim();

  if (query) params.set('q', query);
  if (!filters.levels.includes('all')) {
    params.set('level', filters.levels.join(','));
  }
  if (!filters.topics.includes('all')) {
    params.set('topic', filters.topics.join(','));
  }

  const search = params.toString();
  return search ? `/catalog?${search}` : '/catalog';
}

export function toggleCatalogSelection(
  selected: string[],
  value: string
): string[] {
  if (value === 'all') return ['all'];

  const filtered = selected.filter(item => item !== 'all');
  if (filtered.includes(value)) {
    const updated = filtered.filter(item => item !== value);
    return updated.length > 0 ? updated : ['all'];
  }

  return [...filtered, value];
}
