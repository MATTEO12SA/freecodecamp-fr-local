export type CoursFrView =
  | { v: 'lang' }
  | { v: 'fr-home' }
  | { v: 'fr-cert'; cert: string };

export function parseCoursFrView(search: string): CoursFrView {
  const params = new URLSearchParams(search);
  const certification = params.get('cert')?.trim();

  if (certification) {
    return { v: 'fr-cert', cert: certification };
  }

  if (params.get('view') === 'certifications') {
    return { v: 'fr-home' };
  }

  return { v: 'lang' };
}

export function getCoursFrCertificationHref(certification: string): string {
  const params = new URLSearchParams({ cert: certification });
  return `/cours-fr?${params.toString()}`;
}
