export type CatalogTranslationStatus = 'absent' | 'partial' | 'complete';

export type CatalogIntro = {
  title?: string;
  intro?: string[];
  summary?: string[];
};

const normalize = (value?: string) => value?.trim() || '';

function introLines(value: CatalogIntro): string[] {
  const raw = Array.isArray(value.intro)
    ? value.intro
    : Array.isArray(value.summary)
      ? value.summary
      : [];
  return raw.map(normalize).filter(Boolean);
}

export function getCatalogTranslationStatus({
  translatedFiles,
  totalFiles,
  frenchIntro,
  englishIntro,
  labelsComplete
}: {
  translatedFiles: number;
  totalFiles: number;
  frenchIntro: CatalogIntro;
  englishIntro: CatalogIntro;
  labelsComplete?: boolean;
}): CatalogTranslationStatus {
  if (totalFiles <= 0 || translatedFiles <= 0) return 'absent';
  if (translatedFiles < totalFiles) return 'partial';
  if (labelsComplete === false) return 'partial';

  const frenchTitle = normalize(frenchIntro.title);
  const englishTitle = normalize(englishIntro.title);
  const frenchLines = introLines(frenchIntro);
  const englishLines = introLines(englishIntro);

  const titleTranslated =
    Boolean(frenchTitle) && (!englishTitle || frenchTitle !== englishTitle);
  const bodyTranslated =
    frenchLines.length >= englishLines.length &&
    englishLines.every(
      (englishText, index) =>
        frenchLines[index] && frenchLines[index] !== englishText
    );

  return titleTranslated && bodyTranslated ? 'complete' : 'partial';
}
