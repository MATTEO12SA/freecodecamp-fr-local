export function formatSnapshotAge(
  generatedAt: string,
  now = Date.now()
): string {
  const generated = new Date(generatedAt).getTime();
  if (!Number.isFinite(generated)) return 'inconnu';

  const elapsedMinutes = Math.max(0, Math.floor((now - generated) / 60_000));
  if (elapsedMinutes < 1) return "moins d'une minute";
  if (elapsedMinutes < 60) return `${elapsedMinutes} min`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} h`;

  return `${Math.floor(elapsedHours / 24)} j`;
}
