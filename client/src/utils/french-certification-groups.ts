type CertificationWithKey = {
  key: string;
};

export function groupCertificationsByFrenchAvailability<
  Certification extends CertificationWithKey
>(
  certifications: Certification[],
  isAvailable: (key: string) => boolean
): {
  available: Certification[];
  upcoming: Certification[];
} {
  return certifications.reduce<{
    available: Certification[];
    upcoming: Certification[];
  }>(
    (groups, certification) => {
      const target = isAvailable(certification.key)
        ? groups.available
        : groups.upcoming;
      target.push(certification);
      return groups;
    },
    { available: [], upcoming: [] }
  );
}
