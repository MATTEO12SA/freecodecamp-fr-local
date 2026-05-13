import { readFileSync, writeFileSync } from 'fs';

const ROOT = 'c:/Users/Erazer/.vscode/code/Nouveau dossier/freeCodeCamp/client/i18n/locales/french';

function load(name) {
  return JSON.parse(readFileSync(`${ROOT}/${name}`, 'utf8'));
}
function save(name, obj) {
  writeFileSync(`${ROOT}/${name}`, JSON.stringify(obj, null, 2) + '\n');
}

// translations.json — visible UI strings
const t = load('translations.json');

// === buttons (nav + challenge buttons) ===
Object.assign(t.buttons, {
  'logged-in-cta-btn': 'Commencer (gratuit)',
  'get-started': 'Commencer',
  'logged-out-cta-btn': 'Continuez vos progrès',
  'view-curriculum': 'Voir le cursus',
  'first-lesson': 'Aller à la première leçon',
  close: 'Fermer',
  edit: 'Modifier',
  copy: 'Copier',
  view: 'Voir',
  'submit-continue': 'Envoyer et continuer',
  'view-code': 'Voir le code',
  'view-project': 'Voir le projet',
  'show-cert': 'Afficher la certification',
  'claim-cert': 'Obtenir la certification',
  'save-progress': 'Sauvegarder la progression',
  'sign-in': 'Connexion',
  'sign-out': 'Déconnexion',
  catalog: 'Catalogue',
  curriculum: 'Cursus',
  contribute: 'Contribuer',
  podcast: 'Podcast',
  forum: 'Forum',
  radio: 'Radio',
  profile: 'Profil',
  news: 'Actualités',
  donate: 'Faire un don',
  supporters: 'Soutiens',
  'exam-app': 'Application examen',
  'current-challenge': 'Défi en cours',
  'try-again': 'Réessayer',
  menu: 'Menu',
  settings: 'Paramètres',
  'take-me': 'Aller aux défis',
  'check-answer': 'Vérifier la réponse',
  submit: 'Envoyer',
  'get-hint': 'Indice',
  'ask-for-help': 'Demander de l’aide',
  'create-post': 'Créer un post sur le forum',
  cancel: 'Annuler',
  'reset-lesson': 'Réinitialiser cette leçon',
  revert: 'Annuler',
  'revert-to-saved-code': 'Revenir au code sauvegardé',
  run: 'Lancer',
  'run-test': 'Lancer les tests (Ctrl + Entrée)',
  'check-code': 'Vérifier votre code',
  'check-code-ctrl': 'Vérifier votre code (Ctrl + Entrée)',
  'check-code-cmd': 'Vérifier votre code (Cmd + Entrée)',
  'command-enter': '⌘ + Entrée',
  'ctrl-enter': 'Ctrl + Entrée',
  reset: 'Réinitialiser',
  'reset-step': 'Réinitialiser cette étape',
  help: 'Aide',
  'get-help': 'Obtenir de l’aide',
  'watch-video': 'Regarder une vidéo',
  'click-here': 'Cliquez ici pour vous connecter',
  save: 'Enregistrer',
  'save-code': 'Sauvegarder votre code',
  'show-demo': 'Voir la démo',
  'no-thanks': 'Non merci',
  'yes-please': 'Oui',
  'submit-and-go': 'Envoyer et passer au défi suivant',
  'submit-and-go-ctrl': 'Envoyer et passer au défi suivant (Ctrl + Entrée)',
  'submit-and-go-cmd': 'Envoyer et passer au défi suivant (Cmd + Entrée)',
  'go-to-next': 'Passer au défi suivant',
  'go-to-next-ctrl': 'Passer au défi suivant (Ctrl + Entrée)',
  'go-to-next-cmd': 'Passer au défi suivant (Cmd + Entrée)',
  'ask-later': 'Plus tard',
  'start-coding': 'Commencer à coder !',
  'click-start-course': 'Commencer le cours',
  'click-start-project': 'Commencer le projet',
  'click-start-exam': 'Commencer l’examen',
  'go-to-course': 'Aller au cours',
  'change-language': 'Changer de langue',
  'resume-project': 'Reprendre le projet',
  'start-project': 'Démarrer le projet',
  'previous-question': 'Question précédente',
  'next-question': 'Question suivante',
  'finish-quiz': 'Terminer le quiz',
  'finish-exam': 'Terminer l’examen',
  start: 'Démarrer',
  next: 'Suivant',
  previous: 'Précédent',
  ok: 'OK',
  'next-lesson': 'Leçon suivante',
  'next-step': 'Étape suivante',
  'previous-step': 'Étape précédente',
  back: 'Retour',
  print: 'Imprimer',
  download: 'Télécharger',
  retry: 'Réessayer',
  continue: 'Continuer'
});

// === learn ===
if (t.learn) {
  Object.assign(t.learn, {
    heading: 'Cursus',
    'read-this': 'Lisez ceci',
    'start-project': 'Démarrer le projet',
    'project-complete': 'Projet terminé',
    'completed-challenges': 'Défis terminés',
    'submit-and-go': 'Envoyer et passer au défi suivant',
    'try-again': 'Réessayer',
    'sign-in-save': 'Connectez-vous pour sauvegarder vos progrès',
    'skip-to-content': 'Aller au contenu',
    'tests-passed': 'Tous les tests réussis !',
    completed: 'Terminé',
    'challenge-completed': 'Défi terminé',
    'completion-modal-heading': 'Félicitations !',
    'amazing-job': 'Super travail !',
    'great-job': 'Bien joué !',
    'happy-coding': 'Bon code !',
    'sound-of-music': 'Au boulot !',
    'keep-going': 'Continuez comme ça !',
    'browser-tools': 'Outils de navigation',
    'editor-tabs': 'Onglets de l’éditeur',
    'tests-tab': 'Tests',
    'instructions-tab': 'Instructions',
    'preview-tab': 'Aperçu',
    'view-curriculum': 'Voir le cursus',
    'go-to-next-challenge': 'Passer au défi suivant',
    'no-cert-completed-challenges-msg':
      "Vous n'avez pas encore terminé de défis pour cette certification.",
    'completed-block': 'Bloc terminé',
    'completed-module': 'Module terminé',
    'block-not-completed': 'Bloc non terminé'
  });
}

// === aria ===
if (t.aria) {
  Object.assign(t.aria, {
    'primary-nav': 'Navigation principale',
    'fcc-curriculum': 'Cursus freeCodeCamp',
    'fcc-logo': 'Logo freeCodeCamp',
    'opens-new-window': 'Ouvre dans une nouvelle fenêtre',
    'change-language': 'Changer de langue',
    menu: 'Menu',
    'open-menu': 'Ouvrir le menu',
    'close-menu': 'Fermer le menu',
    home: 'Accueil'
  });
}

// === misc ===
if (t.misc) {
  Object.assign(t.misc, {
    'loading': 'Chargement…',
    'page-not-found': 'Page introuvable',
    'go-home': 'Retour à l’accueil',
    'try-again': 'Réessayer',
    'an-error-occurred': 'Une erreur est survenue',
    note: 'Note',
    info: 'Info',
    warning: 'Attention',
    error: 'Erreur',
    success: 'Succès'
  });
}

// === themes ===
if (t.themes) {
  Object.assign(t.themes, {
    light: 'Clair',
    dark: 'Sombre',
    default: 'Par défaut'
  });
}

// === settings labels (theme toggle in nav) ===
if (t.settings?.labels) {
  Object.assign(t.settings.labels, {
    'night-mode': 'Mode sombre'
  });
}

// === footer ===
if (t.footer) {
  Object.assign(t.footer, {
    'tax-exempt-status': '',
    'mission-statement': '',
    'donation-initiatives': '',
    'trending-guides': 'Articles tendance',
    'mobile-app': 'Application mobile',
    'our-nonprofit': '',
    'donate-text': ''
  });
}

// === flash messages ===
if (t.flash) {
  Object.assign(t.flash, {
    'progress-saved': 'Progression sauvegardée',
    'code-saved': 'Code sauvegardé',
    'cant-save': 'Impossible de sauvegarder',
    'submission-saved': 'Soumission enregistrée'
  });
}

save('translations.json', t);

// meta-tags.json
const meta = load('meta-tags.json');
meta.title = 'Apprendre à coder gratuitement — freeCodeCamp';
meta.social = meta.social || {};
meta.description =
  'Apprenez à coder avec freeCodeCamp : HTML, CSS, JavaScript, Python, et bien plus. Cursus libre et gratuit.';
meta.keywords =
  'apprendre à coder, programmation, HTML, CSS, JavaScript, gratuit, cursus, défis';
save('meta-tags.json', meta);

console.log('Done — translated critical keys in french/translations.json and meta-tags.json');
