import fs from 'fs';
import path from 'path';

import { getChallengesForLang } from '../get-challenges';
import { CURRICULUM_LOCALE } from '../config';

const globalConfigPath = path.resolve(__dirname, '../../generated/');

// Atomic write : ecrit dans .tmp puis renomme. Evite que les lecteurs
// (Gatsby, watcher, etc.) lisent un fichier partiellement ecrit pendant
// un rebuild de curriculum.json (110 MB).
function writeFileAtomic(filePath: string, content: string) {
  const tmpPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(tmpPath, content);
  // fs.renameSync est atomique sur NTFS quand source et destination sont
  // sur le meme volume. On supprime l'ancien fichier d'abord si Windows
  // refuse le rename par-dessus.
  try {
    fs.renameSync(tmpPath, filePath);
  } catch {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    fs.renameSync(tmpPath, filePath);
  }
}

void getChallengesForLang(CURRICULUM_LOCALE)
  .then(JSON.stringify)
  .then(json => {
    fs.mkdirSync(globalConfigPath, { recursive: true });
    writeFileAtomic(`${globalConfigPath}/curriculum.json`, json);
  });
