import { readFileSync, writeFileSync } from 'fs';

const ROOT = 'c:/Users/Erazer/.vscode/code/Nouveau dossier/freeCodeCamp/client/i18n/locales/french';

const t = JSON.parse(readFileSync(`${ROOT}/translations.json`, 'utf8'));

Object.assign(t.learn, {
  heading: 'Cursus',
  'skip-to-content': 'Aller au contenu',
  'welcome-1': 'Bon retour, {{name}}.',
  'welcome-2': 'Bienvenue sur freeCodeCamp',
  'start-at-beginning':
    'Si vous débutez en programmation, nous vous recommandons de <0>commencer par le début</0>.',
  'happy-coding': 'Bon code !',
  'upcoming-lessons': 'Leçons à venir',
  learn: 'Apprendre',
  'wrong-answer': 'Ce n’est pas la bonne réponse. Essayez encore ?',
  'check-answer': 'Cliquez sur le bouton ci-dessous pour vérifier votre réponse.',
  'assignment-not-complete_one': 'Veuillez compléter la tâche',
  'assignment-not-complete_other': 'Veuillez compléter les tâches',
  'assignments_one': 'Tâche',
  'assignments_other': 'Tâches',
  question: 'Question',
  questions: 'Questions',
  'answered-mcq':
    'Vous avez des questions sans réponse ou des réponses incorrectes.',
  explanation: 'Explication',
  transcript: 'Transcription',
  'solution-link': 'Lien de la solution',
  'source-code-link': 'Lien du code source',
  'submit-and-go': 'Envoyer et passer au défi suivant',
  congratulations:
    'Félicitations, votre code passe les tests. Envoyez votre code pour continuer.',
  'congratulations-code-passes': 'Félicitations. Votre code passe les tests.',
  'i-completed': 'J’ai terminé ce défi',
  'example-code': 'Exemple de code',
  'test-output': 'Le résultat de vos tests s’affichera ici',
  'running-tests': '// tests en cours',
  'tests-completed': '// tests terminés',
  'console-output': '// sortie console',
  'syntax-error':
    'Votre code a déclenché une erreur avant que les tests ne puissent s’exécuter. Corrigez-le et réessayez.',
  'indentation-error':
    'Votre code a une erreur d’indentation. Vous devrez peut-être ajouter <code>pass</code> sur une nouvelle ligne pour former un bloc de code valide.',
  'sign-in-save': '',
  'percent-complete': '{{percent}}% terminé',
  'project-complete': 'Projet terminé',
  'tests-passed': 'Tous les tests réussis !',
  completed: 'Terminé',
  'challenge-completed': 'Défi terminé',
  'completion-modal-heading': 'Félicitations !',
  'amazing-job': 'Super travail !',
  'great-job': 'Bien joué !',
  'keep-going': 'Continuez comme ça !',
  'download-solution': 'Télécharger ma solution',
  'download-results': 'Télécharger mes résultats',
  'completed-challenges': 'Défis terminés',
  'view-curriculum': 'Voir le cursus',
  'go-to-next-challenge': 'Passer au défi suivant'
});

// motivation.json — quotes shown on /learn
const m = JSON.parse(readFileSync(`${ROOT}/motivation.json`, 'utf8'));
if (Array.isArray(m.motivationalQuotes)) {
  m.motivationalQuotes = [
    { quote: 'La programmation est l’art de résoudre des problèmes.', author: 'Anonyme' },
    { quote: 'Le seul moyen d’apprendre, c’est de pratiquer.', author: 'Anonyme' },
    { quote: 'Chaque expert a été un débutant.', author: 'Helen Hayes' },
    { quote: 'Le code que vous écrivez aujourd’hui rend votre vie plus simple demain.', author: 'Anonyme' },
    { quote: 'Apprendre à coder, c’est apprendre à penser.', author: 'Steve Jobs' },
    { quote: 'La meilleure façon de prédire l’avenir est de l’écrire.', author: 'Alan Kay' }
  ];
}
writeFileSync(`${ROOT}/motivation.json`, JSON.stringify(m, null, 2) + '\n');

writeFileSync(`${ROOT}/translations.json`, JSON.stringify(t, null, 2) + '\n');

console.log('Done with second-pass translations.');
