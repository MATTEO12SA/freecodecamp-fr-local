import { readFileSync, writeFileSync } from 'fs';

const ROOT =
  'c:/Users/Erazer/.vscode/code/Nouveau dossier/freeCodeCamp/client/i18n/locales/french';
const t = JSON.parse(readFileSync(`${ROOT}/translations.json`, 'utf8'));

if (t.landing) {
  Object.assign(t.landing, {
    'certification-heading': 'Obtenez des certifications gratuites :',
    'core-certs-heading': 'Cursus recommandé :',
    'learn-english-heading': 'Apprenez l’anglais pour développeurs :',
    'learn-spanish-heading': 'Apprenez l’espagnol professionnel :',
    'learn-chinese-heading': 'Apprenez le chinois professionnel :',
    'fsd-b-cta': 'Commencer à apprendre',
    'continue-learning': 'Continuer l’apprentissage',
    'fsd-b-description':
      'Ce cours complet vous prépare à devenir développeur full-stack certifié. Vous apprendrez à créer des applications web complètes avec HTML, CSS, JavaScript, React, TypeScript, Node.js, Python, et plus encore.'
  });
}

if (t.learn) {
  Object.assign(t.learn, {
    'map-title': 'Essayez le défi de codage du jour :',
    'core-certs-heading': 'Cursus recommandé :',
    'start-learning': 'Commencer à apprendre'
  });
}

if (t.buttons) {
  t.buttons['start-learning'] = 'Commencer à apprendre';
  t.buttons['logged-in-cta-btn'] = 'Commencer à apprendre';
}

if (t['daily-coding-challenges']) {
  Object.assign(t['daily-coding-challenges'], {
    title: 'Défis de codage quotidiens',
    'map-title': 'Essayez le défi de codage du jour :'
  });
}

writeFileSync(`${ROOT}/translations.json`, JSON.stringify(t, null, 2) + '\n');
console.log('Third-pass translations applied.');
