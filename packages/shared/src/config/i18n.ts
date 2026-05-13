export enum Languages {
  English = 'english',
  French = 'french'
}

/*
 * List of languages with localizations enabled for builds.
 *
 * Client is the UI, and Curriculum is the Challenge Content.
 *
 * An error will be thrown if the CLIENT_LOCALE and CURRICULUM_LOCALE variables
 * from the .env file aren't found in their respective arrays below
 */
export const availableLangs = {
  client: [Languages.English, Languages.French],
  curriculum: [Languages.English, Languages.French]
};

// ---------------------------------------------------------------------------

// Each client language needs an entry in the rest of the variables below

/* These strings set the i18next language. It needs to be the two character
 * string for the language to take advantage of available functionality.
 * Use a 639-1 code here https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */
export const i18nextCodes = {
  [Languages.English]: 'en',
  [Languages.French]: 'fr'
};

// These are for the language selector dropdown menu in the footer
export const LangNames: { [key: string]: string } = {
  [Languages.English]: 'English',
  [Languages.French]: 'Français'
};

/* These are for formatting dates and numbers. Used with JS .toLocaleString().
 * There's an example in profile/components/Camper.js
 * List: https://github.com/unicode-cldr/cldr-dates-modern/tree/master/main
 */
export const LangCodes = {
  [Languages.English]: 'en-US',
  [Languages.French]: 'fr-FR'
};

/**
 * This array contains languages that should NOT appear in the language selector.
 */
export const hiddenLangs: Languages[] = [];

/**
 * This array contains languages that use the RTL layouts.
 */
export const rtlLangs: Languages[] = [];

// locale is sourced from a JSON file, so we use getLangCode to
// find the associated enum values

export function getLangCode(locale: PropertyKey): string {
  if (isPropertyOf(LangCodes, locale)) return LangCodes[locale];
  throw new Error(`${String(locale)} is not a valid locale`);
}

function isPropertyOf<O>(
  obj: Record<string, string>,
  key: PropertyKey
): key is keyof O {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
