/**
 * Fixed sample scenarios for human QA v1.
 * Paths are /learn/<superblock>/<block>/<dashedName>.
 */

export const editorScenarios = [
  {
    id: 'rwd-cat-step-1',
    label: 'RWD cat-photo step-1',
    path: '/learn/responsive-web-design-v9/workshop-cat-photo-app/step-1',
    kind: 'editor',
    frMarkers: ['balise ouvrante', 'CatPhotoApp', 'Vérifier votre code'],
    wrongSolution: '<h1>Wrong</h1>',
    // Editable region only contains the h1 line
    solution: '<h1>CatPhotoApp</h1>',
    expectWrongFail: true,
    shotName: 'rwd-cat-step1.png'
  },
  {
    id: 'js-greeting-step-1',
    label: 'JS greeting-bot step-1',
    path: '/learn/javascript-v9/workshop-greeting-bot/step-1',
    kind: 'editor',
    frMarkers: ['bot de salutation', 'console.log', 'Hi there!'],
    wrongSolution: 'console.log("nope");',
    solution: 'console.log("Hi there!");',
    expectWrongFail: true,
    slowTail: 8,
    shotName: 'js-greeting-step1.png'
  },
  {
    id: 'py-pin-step-1',
    label: 'Python pin-extractor step-1',
    path: '/learn/python-v9/workshop-pin-extractor/step-1',
    kind: 'editor',
    frMarkers: ['extracteur de code PIN', 'pin_extractor', 'pass'],
    solution: 'def pin_extractor(poem):\n    pass\n',
    expectWrongFail: false,
    shotName: 'py-pin-step1.png'
  },
  {
    id: 'js-lab-trivia',
    label: 'JS lab trivia-bot',
    path: '/learn/javascript-v9/lab-javascript-trivia-bot/lab-javascript-trivia-bot',
    kind: 'editor',
    frMarkers: ['User Stories', 'Objectif', 'coding fun fact guide'],
    solution: `console.log("Hello! I'm your coding fun fact guide!");

const botName = "JsBot";
const botLocation = "planet Eris";
const favoriteLanguage = "JavaScript";

console.log("My name is " + botName + " and I live on " + botLocation + ".");
console.log("My favorite programming language is " + favoriteLanguage + ".");

let codingFact = "Did you know that " + favoriteLanguage + " was created in just 10 days?";

console.log(codingFact);

codingFact = "Another fun fact: " + favoriteLanguage + "was originally called Mocha!";

console.log(codingFact);

codingFact = "Also, " + favoriteLanguage + " is the most popular programming language in the world.";

console.log(codingFact);

console.log("It was fun sharing these facts with you. Goodbye! - " + botName + " from " + botLocation + ".");
`,
    expectWrongFail: false,
    shotName: 'js-lab-trivia.png'
  }
];

export const quizScenario = {
  id: 'py-quiz-basics',
  label: 'Python quiz basics',
  path: '/learn/python-v9/quiz-python-basics/quiz-python-basics',
  kind: 'quiz',
  frMarkers: ['réussir le quiz', 'questions'],
  questionMarker: 'Laquelle de ces fonctions',
  shotName: 'py-quiz-basics.png'
};
