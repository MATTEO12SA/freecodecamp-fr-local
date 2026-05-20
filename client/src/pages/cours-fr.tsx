import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import { useDispatch } from 'react-redux';
import { Container, Col, Row, Spacer } from '@freecodecamp/ui';
import { SuperBlocks } from '@freecodecamp/shared/config/curriculum';
import { challengeTypes } from '@freecodecamp/shared/config/challenge-types';
import type {
  BlockLabel,
  BlockLayouts
} from '@freecodecamp/shared/config/blocks';
import LearnLayout from '../components/layouts/learn';
import SEO from '../components/seo';
import type { ChapterBasedSuperBlockStructure } from '../redux/prop-types';
import { SuperBlockAccordion } from '../templates/Introduction/components/super-block-accordion';
import { resetExpansion, toggleBlock } from '../templates/Introduction/redux';

import './cours-fr.css';

type Challenge = {
  id: string;
  title: string;
  block: string;
  blockLabel?: BlockLabel;
  blockLayout: BlockLayouts;
  challengeOrder: number;
  challengeType: number;
  dashedName: string;
  order: number;
  superBlock: SuperBlocks;
  description: string | null;
  fields: { slug: string };
};

type ChallengeNode = { challenge: Challenge };

type PageData = {
  allChallengeNode: { nodes: ChallengeNode[] };
  allSuperBlockStructure: { nodes: ChapterBasedSuperBlockStructure[] };
};

type CertificationBlock = {
  key: string;
  title: string;
  translated: boolean;
};

type Certification = {
  key: string;
  title: string;
  subtitle: string;
  overview?: {
    cta: string;
    paragraphs: string[];
    requirementsTitle: string;
    requirements: string[];
  };
  blocks: CertificationBlock[];
};

const UNSUPPORTED_LOCAL_SUPERBLOCKS = new Set<string>(['dev-playground']);

const UNSUPPORTED_LOCAL_BLOCKS = new Set<string>([
  'daily-coding-challenges-javascript',
  'daily-coding-challenges-python'
]);

const UNSUPPORTED_LOCAL_CHALLENGE_TYPES = new Set<number>([
  challengeTypes.backEndProject,
  challengeTypes.pythonProject,
  challengeTypes.codeAllyPractice,
  challengeTypes.codeAllyCert,
  challengeTypes.theOdinProject,
  challengeTypes.colab,
  challengeTypes.exam,
  challengeTypes.msTrophy,
  challengeTypes.dailyChallengeJs,
  challengeTypes.dailyChallengePy,
  challengeTypes.examDownload
]);

function isLocalChallenge(challenge: Challenge): boolean {
  return (
    !UNSUPPORTED_LOCAL_SUPERBLOCKS.has(challenge.superBlock) &&
    !UNSUPPORTED_LOCAL_BLOCKS.has(challenge.block) &&
    !UNSUPPORTED_LOCAL_CHALLENGE_TYPES.has(challenge.challengeType)
  );
}

const CERTIFICATIONS: Certification[] = [
  {
    key: 'responsive-web-design-v9',
    title: 'Responsive Web Design',
    subtitle: 'HTML & CSS pour concevoir des sites modernes et responsives.',
    blocks: [
      {
        key: 'workshop-curriculum-outline',
        title: 'Créer un plan de curriculum',
        translated: true
      },
      {
        key: 'lab-debug-camperbots-profile-page',
        title: 'Déboguer la page de profil de Camperbot',
        translated: true
      },
      {
        key: 'lecture-understanding-html-attributes',
        title: 'Comprendre les attributs HTML',
        translated: true
      },
      {
        key: 'lab-debug-pet-adoption-page',
        title: "Déboguer une page d'adoption d'animaux",
        translated: true
      },
      {
        key: 'lecture-understanding-the-html-boilerplate',
        title: 'Comprendre le boilerplate HTML',
        translated: true
      },
      {
        key: 'workshop-cat-photo-app',
        title: 'Apprendre HTML en créant une application de photos de chats',
        translated: true
      },
      {
        key: 'lab-recipe-page',
        title: 'Créer une page de recette',
        translated: true
      },
      {
        key: 'lecture-html-fundamentals',
        title: 'Comprendre les fondamentaux HTML',
        translated: true
      },
      {
        key: 'workshop-bookstore-page',
        title: 'Créer une page de librairie',
        translated: true
      },
      {
        key: 'lecture-understanding-how-html-affects-seo',
        title: 'Comprendre comment le HTML influence le SEO',
        translated: true
      },
      {
        key: 'lab-travel-agency-page',
        title: "Construire une page d'agence de voyage",
        translated: true
      },
      {
        key: 'lecture-working-with-audio-and-video-elements',
        title: 'Travailler avec les éléments audio et vidéo',
        translated: true
      },
      {
        key: 'workshop-html-music-player',
        title: 'Créer un lecteur de musique HTML',
        translated: true
      },
      {
        key: 'workshop-cafe-menu',
        title: 'Apprendre le CSS de base en créant un menu de café',
        translated: true
      },
      // TODO: traduire en français
      {
        key: 'learn-css-colors-by-building-a-set-of-colored-markers',
        title: 'Learn CSS Colors by Building a Set of Colored Markers',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'learn-html-forms-by-building-a-registration-form',
        title: 'Learn HTML Forms by Building a Registration Form',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'build-a-survey-form-project',
        title: 'Survey Form',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'learn-the-css-box-model-by-building-a-rothko-painting',
        title: 'Learn the CSS Box Model by Building a Rothko Painting',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'learn-css-flexbox-by-building-a-photo-gallery',
        title: 'Learn CSS Flexbox by Building a Photo Gallery',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'learn-typography-by-building-a-nutrition-label',
        title: 'Learn Typography by Building a Nutrition Label',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'learn-accessibility-by-building-a-quiz',
        title: 'Learn Accessibility by Building a Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'build-a-tribute-page-project',
        title: 'Tribute Page',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'learn-more-about-css-pseudo-selectors-by-building-a-balance-sheet',
        title:
          'Learn More About CSS Pseudo Selectors by Building A Balance Sheet',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'learn-intermediate-css-by-building-a-cat-painting',
        title: 'Learn Intermediate CSS by Building a Cat Painting',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'learn-responsive-web-design-by-building-a-piano',
        title: 'Learn Responsive Web Design by Building a Piano',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'build-a-technical-documentation-page-project',
        title: 'Technical Documentation Page',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'learn-css-variables-by-building-a-city-skyline',
        title: 'Learn CSS Variables by Building a City Skyline',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'learn-css-grid-by-building-a-magazine',
        title: 'Learn CSS Grid by Building a Magazine',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'build-a-product-landing-page-project',
        title: 'Product Landing Page',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'learn-css-animation-by-building-a-ferris-wheel',
        title: 'Learn CSS Animation by Building a Ferris Wheel',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'learn-css-transforms-by-building-a-penguin',
        title: 'Learn CSS Transforms by Building a Penguin',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'build-a-personal-portfolio-webpage-project',
        title: 'Personal Portfolio Webpage',
        translated: false
      }
    ]
  },
  {
    key: 'javascript-v9',
    title: 'JavaScript',
    subtitle:
      'Programmer en JavaScript : variables, fonctions, tableaux, objets.',
    blocks: [
      // TODO: traduire en français
      {
        key: 'lecture-introduction-to-javascript',
        title: 'Introduction to JavaScript',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-introduction-to-strings',
        title: 'Introduction to Strings',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-code-clarity',
        title: 'Understanding Code Clarity',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-greeting-bot',
        title: 'Build a Greeting Bot',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-javascript-trivia-bot',
        title: 'Build a JavaScript Trivia Bot',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-sentence-maker',
        title: 'Build a Sentence Maker',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-data-types',
        title: 'Working with Data Types',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-javascript-variables-and-data-types',
        title: 'JavaScript Variables and Data Types Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-javascript-variables-and-data-types',
        title: 'JavaScript Variables and Data Types Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-strings-in-javascript',
        title: 'Working with Strings in JavaScript',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-teacher-chatbot',
        title: 'Build a Teacher Chatbot',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-string-character-methods',
        title: 'Working with String Character Methods',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-string-search-and-slice-methods',
        title: 'Working with String Search and Slice Methods',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-string-inspector',
        title: 'Build a String Inspector',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-string-formatting-methods',
        title: 'Working with String Formatting Methods',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-string-formatter',
        title: 'Build a String Formatter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-string-modification-methods',
        title: 'Working with String Modification Methods',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-string-transformer',
        title: 'Build a String Transformer',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-javascript-strings',
        title: 'JavaScript Strings Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-javascript-strings',
        title: 'JavaScript Strings Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-numbers-and-arithmetic-operators',
        title: 'Working with Numbers and Arithmetic Operators',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-debug-type-coercion-errors',
        title: 'Debug Type Coercion Errors in a Buggy App',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-operator-behavior',
        title: 'Working with Operator Behavior',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-debug-increment-and-decrement-operator-errors',
        title: 'Debug Increment and Decrement Operator Errors in a Buggy App',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-comparison-and-boolean-operators',
        title: 'Working with Comparison and Boolean Operators',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-logic-checker-app',
        title: 'Build a Logic Checker App',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-unary-and-bitwise-operators',
        title: 'Working with Unary and Bitwise Operators',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-conditional-logic-and-math-methods',
        title: 'Working with Conditional Logic and Math Methods',
        translated: false
      },
      // TODO: traduire en français
      { key: 'workshop-mathbot', title: 'Build a Mathbot', translated: false },
      // TODO: traduire en français
      {
        key: 'lab-fortune-teller',
        title: 'Build a Fortune Teller',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-numbers-and-common-number-methods',
        title: 'Working with Numbers and Common Number Methods',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-javascript-math',
        title: 'JavaScript Math Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-javascript-math',
        title: 'JavaScript Math Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-comparisons-and-conditionals',
        title: 'Understanding Comparisons and Conditionals',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-javascript-comparisons-and-conditionals',
        title: 'JavaScript Comparisons and Conditionals Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-javascript-comparisons-and-conditionals',
        title: 'JavaScript Comparisons and Conditionals Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-functions',
        title: 'Working with Functions',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-calculator',
        title: 'Build a Calculator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-boolean-check',
        title: 'Build a Boolean Check Function',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-email-masker',
        title: 'Build an Email Masker',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-loan-qualification-checker',
        title: 'Build a Loan Qualification Checker',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-celsius-to-fahrenheit-converter',
        title: 'Build a Celsius to Fahrenheit Converter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-counting-cards',
        title: 'Build a Card Counting Assistant',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-leap-year-calculator',
        title: 'Build a Leap Year Calculator ',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-truncate-string',
        title: 'Implement the Truncate String Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-string-ending-checker',
        title: 'Build a Confirm the Ending Tool',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-javascript-functions',
        title: 'JavaScript Functions Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-javascript-functions',
        title: 'JavaScript Functions Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-arrays',
        title: 'Working with Arrays',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-shopping-list',
        title: 'Build a Shopping List',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-lunch-picker-program',
        title: 'Build a Lunch Picker Program',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-golf-score-translator',
        title: 'Build a Golf Score Translator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-common-array-methods',
        title: 'Working with Common Array Methods',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-javascript-arrays',
        title: 'JavaScript Arrays Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-javascript-arrays',
        title: 'JavaScript Arrays Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-introduction-to-javascript-objects-and-their-properties',
        title: 'Introduction to JavaScript Objects and Their Properties',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-wildlife-tracker',
        title: 'Build a Wildlife Tracker',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-cargo-manifest-validator',
        title: 'Build a Cargo Manifest Validator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-json',
        title: 'Working with JSON',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-optional-chaining-and-object-destructuring',
        title: 'Working with Optional Chaining and Object Destructuring',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-recipe-tracker',
        title: 'Build a Recipe Tracker',
        translated: false
      },
      // TODO: traduire en français
      { key: 'lab-quiz-game', title: 'Build a Quiz Game', translated: false },
      // TODO: traduire en français
      {
        key: 'lab-record-collection',
        title: 'Build a Record Collection',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-javascript-objects',
        title: 'JavaScript Objects Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-javascript-objects',
        title: 'JavaScript Objects Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-loops',
        title: 'Working with Loops',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-word-counter',
        title: 'Build a Word Counter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-sentence-analyzer',
        title: 'Build a Sentence Analyzer',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-space-mission-roster',
        title: 'Build a Space Mission Roster',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-heritage-library-catalog',
        title: 'Build a Heritage Library Catalog',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-longest-word-in-a-string',
        title: 'Build a Longest Word Finder App',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-factorial-calculator',
        title: 'Build a Factorial Calculator ',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-mutations',
        title: 'Implement the Mutations Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-chunky-monkey',
        title: 'Implement the Chunky Monkey Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-profile-lookup',
        title: 'Build a Profile Lookup',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-repeat-a-string',
        title: 'Build a String Repeating Function',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-festival-crowd-flow-simulator',
        title: 'Build a Festival Crowd Flow Simulator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-missing-letter-detector',
        title: 'Build a Missing Letter Detector',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-javascript-loops',
        title: 'JavaScript Loops Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-javascript-loops',
        title: 'JavaScript Loops Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-types-and-objects',
        title: 'Working with Types and Objects',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-arrays-variables-and-naming-practices',
        title: 'Working with Arrays, Variables, and Naming Practices',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-code-quality-and-execution-concepts',
        title: 'Working with Code Quality and Execution Concepts',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-reverse-a-string',
        title: 'Build a String Inverter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-largest-number-finder',
        title: 'Build the Largest Number Finder',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-first-element-finder',
        title: 'Build a First Element Finder',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-slice-and-splice',
        title: 'Implement the Slice and Splice Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-pyramid-generator',
        title: 'Build a Pyramid Generator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-gradebook-app',
        title: 'Build a Gradebook App',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-the-var-keyword-and-hoisting',
        title: 'The var Keyword and Hoisting',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-title-case-converter',
        title: 'Build a Title Case Converter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-falsy-remover',
        title: 'Implement a Falsy Remover',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-inventory-management-program',
        title: 'Build an Inventory Management Program',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-modules-imports-and-exports',
        title: 'Understanding Modules, Imports, and Exports',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-the-arguments-object-and-rest-parameters',
        title: 'Working With the Arguments Object and Rest Parameters',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-unique-sorted-union',
        title: 'Implement a Unique Sorted Union',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-password-generator',
        title: 'Build a Password Generator App',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-sum-all-numbers-algorithm',
        title: 'Design a Sum All Numbers Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-dna-pair-generator',
        title: 'Implement a DNA Pair Generator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-html-entitiy-converter',
        title: 'Implement an HTML Entity Converter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-odd-fibonacci-sum-calculator',
        title: 'Build an Odd Fibonacci Sum Calculator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-element-skipper',
        title: 'Implement an Element Skipper',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-playlist-remix-engine',
        title: 'Build a Playlist Remix Engine',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-javascript-fundamentals',
        title: 'JavaScript Fundamentals Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-javascript-fundamentals',
        title: 'JavaScript Fundamentals Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-higher-order-functions-and-callbacks',
        title: 'Working with Higher Order Functions and Callbacks',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-library-manager',
        title: 'Build a Library Manager',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-book-organizer',
        title: 'Build a Book Organizer',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-sorted-index-finder',
        title: 'Implement a Sorted Index Finder',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-symmetric-difference',
        title: 'Build a Symmetric Difference Function',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-value-remover-function',
        title: 'Implement a Value Remover Function',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-matching-object-filter',
        title: 'Implement a Matching Object Filter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-prime-number-sum-calculator',
        title: 'Build a Prime Number Sum Calculator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-range-based-lcm-calculator',
        title: 'Implement a Range-Based LCM Calculator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-deep-flattening-tool',
        title: 'Create a Deep Flattening Tool',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-all-true-property-validator',
        title: 'Build an All-True Property Validator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-javascript-higher-order-functions',
        title: 'JavaScript Higher Order Functions Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-javascript-higher-order-functions',
        title: 'JavaScript Higher Order Functions Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-the-dom-click-events-and-web-apis',
        title: 'Working with the DOM, Click Events, and Web APIs',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-storytelling-app',
        title: 'Build a Storytelling App',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-emoji-reactor',
        title: 'Build an Emoji Reactor',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-favorite-icon-toggler',
        title: 'Build a Favorite Icon Toggler',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-the-event-object-and-event-delegation',
        title: 'Understanding the Event Object and Event Delegation',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-music-instrument-filter',
        title: 'Build a Music Instrument Filter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-real-time-counter',
        title: 'Build a Real Time Counter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-lightbox-viewer',
        title: 'Build a Lightbox Viewer',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-rps-game',
        title: 'Build a Rock, Paper, Scissors Game',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-football-team-cards',
        title: 'Build a Set of Football Team Cards',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-dom-manipulation-and-click-events-with-javascript',
        title: 'DOM Manipulation and Click Events with JavaScript Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-dom-manipulation-and-click-event-with-javascript',
        title: 'DOM Manipulation and Click Events with JavaScript Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-aria-expanded-aria-live-and-common-aria-states',
        title: 'Understanding aria-expanded, aria-live, and Common ARIA States',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-planets-tablist',
        title: 'Build a Planets Tablist',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-note-taking-app',
        title: 'Build a Note Taking App',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-theme-switcher',
        title: 'Build a Theme Switcher',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-js-a11y',
        title: 'JavaScript and Accessibility Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-js-a11y',
        title: 'JavaScript and Accessibility Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-debugging-techniques',
        title: 'Debugging Techniques',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-random-background-color-changer',
        title: 'Debug a Random Background Color Changer',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-debugging-javascript',
        title: 'Debugging JavaScript Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-debugging-javascript',
        title: 'Debugging JavaScript Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-regular-expressions',
        title: 'Working with Regular Expressions',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-spam-filter',
        title: 'Build a Spam Filter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-palindrome-checker',
        title: 'Build a Palindrome Checker',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-regex-sandbox',
        title: 'Build a RegEx Sandbox',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-spinal-case-converter',
        title: 'Implement a Spinal Case Converter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-pig-latin',
        title: 'Implement a Pig Latin Translator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-smart-word-replacement',
        title: 'Build a Smart Word Replacement Function',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-javascript-regular-expressions',
        title: 'JavaScript Regular Expressions Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-javascript-regular-expressions',
        title: 'JavaScript Regular Expressions Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-markdown-to-html-converter',
        title: 'Build a Markdown to HTML Converter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-form-validation',
        title: 'Understanding Form Validation',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-calorie-counter',
        title: 'Build a Calorie Counter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-customer-complaint-form',
        title: 'Build a Customer Complaint Form',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-form-validation-with-javascript',
        title: 'Form Validation with JavaScript Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-form-validation-with-javascript',
        title: 'Form Validation with JavaScript Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-dates',
        title: 'Working with Dates',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-date-conversion',
        title: 'Build a Date Conversion Program',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-javascript-dates',
        title: 'JavaScript Dates Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-javascript-dates',
        title: 'JavaScript Dates Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-audio-and-video',
        title: 'Working with Audio and Video',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-music-player',
        title: 'Build a Music Player',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-javascript-audio-and-video',
        title: 'JavaScript Audio and Video Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-javascript-audio-and-video',
        title: 'JavaScript Audio and Video Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-drum-machine',
        title: 'Build a Drum Machine',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-maps-and-sets',
        title: 'Working with Maps and Sets',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-plant-nursery-catalog',
        title: 'Build a Plant Nursery Catalog',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-javascript-maps-and-sets',
        title: 'JavaScript Maps and Sets Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-javascript-maps-and-sets',
        title: 'JavaScript Maps and Sets Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-voting-system',
        title: 'Build a Voting System',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-client-side-storage-and-crud-operations',
        title: 'Working with Client-Side Storage and CRUD Operations',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-todo-app',
        title: 'Build a Todo App using Local Storage',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-bookmark-manager-app',
        title: 'Build a Bookmark Manager App',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-local-storage-and-crud',
        title: 'Local Storage and CRUD Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-local-storage-and-crud',
        title: 'Local Storage and CRUD Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-how-to-work-with-classes-in-javascript',
        title: 'Understanding How to Work with Classes in JavaScript',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-shopping-cart',
        title: 'Build a Shopping Cart',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-project-idea-board',
        title: 'Build a Project Idea Board',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-javascript-classes',
        title: 'JavaScript Classes Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-javascript-classes',
        title: 'JavaScript Classes Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-bank-account-manager',
        title: 'Build a Bank Account Management Program',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-recursion-and-the-call-stack',
        title: 'Understanding Recursion and the Call Stack',
        translated: false
      },
      // TODO: traduire en français
      { key: 'workshop-countup', title: 'Build a Countup', translated: false },
      // TODO: traduire en français
      { key: 'lab-countdown', title: 'Build a Countdown', translated: false },
      // TODO: traduire en français
      {
        key: 'lab-range-of-numbers',
        title: 'Build a Range of Numbers Generator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-decimal-to-binary-converter',
        title: 'Build a Decimal to Binary Converter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-permutation-generator',
        title: 'Build a Permutation Generator',
        translated: false
      },
      // TODO: traduire en français
      { key: 'review-recursion', title: 'Recursion Review', translated: false },
      // TODO: traduire en français
      { key: 'quiz-recursion', title: 'Recursion Quiz', translated: false },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-common-data-structures-js',
        title: 'Working with Common Data Structures',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-linked-list-js',
        title: 'Build a Linked List',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-linked-list-operations',
        title: 'Implement Linked List Operations',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-implement-a-stack',
        title: 'Implement a Stack',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-implement-a-queue',
        title: 'Implement a Queue',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-data-structures-js',
        title: 'Data Structures Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-data-structures-js',
        title: 'Data Structures Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-introduction-to-common-searching-and-sorting-algorithms',
        title: 'Introduction to Common Searching and Sorting Algorithms',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-binary-search-js',
        title: 'Implement the Binary Search Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-merge-sort-js',
        title: 'Implement the Merge Sort Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-bubble-sort-algorithm',
        title: 'Implement the Bubble Sort Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-selection-sort-js',
        title: 'Implement the Selection Sort Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-insertion-sort',
        title: 'Implement the Insertion Sort Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-quicksort-js',
        title: 'Implement the Quicksort Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-searching-and-sorting-algorithms-js',
        title: 'Searching and Sorting Algorithms Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-searching-and-sorting-algorithms-js',
        title: 'Searching and Sorting Algorithms Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-graphs-and-trees-js',
        title: 'Understanding Graphs and Trees',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-shortest-path-algorithm-js',
        title: 'Implement the Shortest Path Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-adjacency-list-to-matrix-converter-js',
        title: 'Build an Adjacency List to Matrix Converter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-breadth-first-search-js',
        title: 'Implement the Breadth-First Search Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-depth-first-search-js',
        title: 'Implement the Depth-First Search Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-n-queens-problem-js',
        title: 'Implement the N-Queens Problem',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-graphs-and-trees-js',
        title: 'Graphs and Trees Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-graph-and-trees-js',
        title: 'Graphs and Trees Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-dynamic-programming-js',
        title: 'Understanding Dynamic Programming',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-nth-fibonacci-number-js',
        title: 'Build an Nth Fibonacci Number Calculator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-dynamic-programming-js',
        title: 'Dynamic Programming Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-dynamic-programming-js',
        title: 'Dynamic Programming Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-functional-programming',
        title: 'Understanding Functional Programming',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-recipe-ingredient-converter',
        title: 'Build a Recipe Ingredient Converter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-optional-arguments-sum-function',
        title: 'Build an Optional Arguments Sum Function',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-sorting-visualizer',
        title: 'Build a Sorting Visualizer',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-javascript-functional-programming',
        title: 'JavaScript Functional Programming Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-javascript-functional-programming',
        title: 'JavaScript Functional Programming Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-asynchronous-programming',
        title: 'Understanding Asynchronous Programming',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-fcc-authors-page',
        title: 'Build an fCC Authors Page',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-fcc-forum-leaderboard',
        title: 'Build an fCC Forum Leaderboard',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-asynchronous-javascript',
        title: 'Asynchronous JavaScript Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-asynchronous-javascript',
        title: 'Asynchronous JavaScript Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-weather-app',
        title: 'Build a Weather App',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-javascript',
        title: 'JavaScript Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'exam-javascript-certification',
        title: 'JavaScript Certification Exam',
        translated: false
      }
    ]
  },
  {
    key: 'front-end-development-libraries-v9',
    title: 'Bibliothèques Front-End',
    subtitle:
      'React, Redux et autres outils modernes de développement front-end.',
    overview: {
      cta: "Commencer l'apprentissage",
      paragraphs: [
        'Cette certification te fait pratiquer les bibliothèques que les développeurs utilisent pour créer des interfaces web modernes : React, TypeScript, outils CSS, tests, performance, visualisation de données, et plus encore.',
        'L’objectif n’est pas seulement de lire des notions : tu vas construire des ateliers et des labs pour apprendre comment organiser une interface, gérer l’état, typer ton code et préparer des projets front-end solides.'
      ],
      requirementsTitle:
        'Pour obtenir la certification Bibliothèques Front-End :',
      requirements: [
        "termine les cinq projets obligatoires pour débloquer l'examen de certification ;",
        "réussis l'examen final Bibliothèques Front-End."
      ]
    },
    blocks: [
      // TODO: traduire en français
      {
        key: 'lecture-introduction-to-javascript-libraries-and-frameworks',
        title: 'Introduction to JavaScript Libraries and Frameworks',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-reusable-mega-navbar',
        title: 'Build a Reusable Mega Navbar',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-reusable-footer',
        title: 'Build a Reusable Footer',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-data-in-react',
        title: 'Working with Data in React',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-reusable-profile-card-component',
        title: 'Build a Reusable Profile Card Component',
        translated: false
      },
      // TODO: traduire en français
      { key: 'lab-mood-board', title: 'Build a Mood Board', translated: false },
      // TODO: traduire en français
      {
        key: 'review-react-basics',
        title: 'React Basics Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-react-basics',
        title: 'React Basics Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-state-and-responding-to-events-in-react',
        title: 'Working with State and Responding to Events in React',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-toggle-text-app',
        title: 'Toggle Text App',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-color-picker',
        title: 'Build a Color Picker App',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-effects-and-referencing-values-in-react',
        title: 'Understanding Effects and Referencing Values in React',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-fruit-search-app',
        title: 'Build a Fruit Search App',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-one-time-password-generator',
        title: 'Build a One-Time Password Generator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-react-state-and-hooks',
        title: 'React State and Hooks Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-react-state-and-hooks',
        title: 'React State and Hooks Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-forms-in-react',
        title: 'Working with Forms in React',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-superhero-application-form',
        title: 'Build a Superhero Application Form',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-event-rsvp',
        title: 'Build an Event RSVP',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-data-fetching-and-memoization-in-react',
        title: 'Working with Data Fetching and Memoization in React',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-shopping-list-app',
        title: 'Build a Shopping List App',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-routing-react-frameworks-and-dependency-management-tools',
        title: 'Routing, React Frameworks, and Dependency Management Tools',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-react-strategies-and-debugging',
        title: 'React Strategies and Debugging',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-react-forms-data-fetching-and-routing',
        title: 'React Forms, Data Fetching and Routing Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-react-forms-data-fetching-and-routing',
        title: 'React Forms, Data Fetching and Routing Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-currency-converter',
        title: 'Build a Currency Converter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-tic-tac-toe',
        title: 'Build a Tic-Tac-Toe Game',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-performance-in-web-applications',
        title: 'Understanding Performance in Web Applications',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-web-performance',
        title: 'Web Performance Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-web-performance',
        title: 'Web Performance Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-the-different-types-of-testing',
        title: 'Understanding the Different Types of Testing',
        translated: false
      },
      // TODO: traduire en français
      { key: 'review-testing', title: 'Testing Review', translated: false },
      // TODO: traduire en français
      { key: 'quiz-testing', title: 'Testing Quiz', translated: false },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-css-libraries-and-frameworks',
        title: 'Working with CSS Libraries and Frameworks',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-error-message-component',
        title: 'Build an Error Message Component',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-tailwind-cta-component',
        title: 'Build a CTA Component',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-tailwind-pricing-component',
        title: 'Build a Pricing Component',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-music-shopping-cart-page',
        title: 'Build a Music Shopping Cart Page',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-photography-exhibit',
        title: 'Design a Photography Exhibit',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-css-libraries-and-frameworks',
        title: 'CSS Libraries and Frameworks Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-css-libraries-and-frameworks',
        title: 'CSS Libraries and Frameworks Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-introduction-to-typescript',
        title: 'Introduction to TypeScript',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-type-safe-user-profile',
        title: 'Build a Type Safe User Profile',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-type-safe-math-toolkit',
        title: 'Build a Type Safe Math Toolkit',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-type-composition',
        title: 'Understanding Type Composition',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-shape-manager',
        title: 'Build a Shape Manager',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-motorcycle-shop',
        title: 'Build a Motorcycle Shop',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-generics-and-type-narrowing',
        title: 'Working with Generics and Type Narrowing',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-bug-emoji-picker',
        title: 'Build a Bug Emoji Picker',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-product-showcase',
        title: 'Build a Product Showcase',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-typescript-configuration-files',
        title: 'Working with TypeScript Configuration Files',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-fortune-teller-app',
        title: 'Build a Fortune Telling App',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-flashcard-quiz-app',
        title: 'Build a Flashcard Quiz App',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-build-a-football-player-card-builder',
        title: 'Build a Football Player Card Builder',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-digital-pet-game',
        title: 'Build a Digital Pet Game',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-typescript',
        title: 'TypeScript Review',
        translated: false
      },
      // TODO: traduire en français
      { key: 'quiz-typescript', title: 'TypeScript Quiz', translated: false },
      // TODO: traduire en français
      {
        key: 'lecture-introduction-to-data-visualization',
        title: 'Introduction to Data Visualization',
        translated: false
      },
      // TODO: traduire en français
      { key: 'lab-bar-chart', title: 'Build a Bar Chart', translated: false },
      // TODO: traduire en français
      {
        key: 'lab-scatterplot-graph',
        title: 'Build a Scatterplot Graph',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-front-end-libraries',
        title: 'Front-End Libraries Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'exam-front-end-development-libraries-certification',
        title: 'Front-End Development Libraries Certification Exam',
        translated: false
      }
    ]
  },
  {
    key: 'python-v9',
    title: 'Python',
    subtitle: 'Apprendre Python : syntaxe, structures de données, algorithmes.',
    blocks: [
      // TODO: traduire en français
      {
        key: 'lecture-introduction-to-python',
        title: 'Introduction to Python',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-variables-and-data-types',
        title: 'Understanding Variables and Data Types',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-report-card-printer',
        title: 'Build a Report Card Printer',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-introduction-to-python-strings',
        title: 'Introduction to Strings',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-employee-profile-generator',
        title: 'Build an Employee Profile Generator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-numbers-and-mathematical-operations',
        title: 'Numbers and Mathematical Operations',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-bill-splitter',
        title: 'Build a Bill Splitter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-booleans-and-conditionals',
        title: 'Booleans and Conditionals',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-movie-ticket-booking-calculator',
        title: 'Build a Movie Ticket Booking Calculator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-travel-weather-planner',
        title: 'Build a Travel Weather Planner',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-functions-and-scope',
        title: 'Understanding Functions and Scope',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-discount-calculator',
        title: 'Build an Apply Discount Function',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-caesar-cipher',
        title: 'Build a Caesar Cipher',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-rpg-character',
        title: 'Build an RPG Character',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-python-basics',
        title: 'Python Basics Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-python-basics',
        title: 'Python Basics Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-loops-and-sequences',
        title: 'Working with Loops and Sequences',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-pin-extractor',
        title: 'Build a Pin Extractor',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-number-pattern-generator',
        title: 'Build a Number Pattern Generator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-loops-and-sequences',
        title: 'Loops and Sequences Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-loops-and-sequences',
        title: 'Loops and Sequences Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-dictionaries-and-sets',
        title: 'Working with Dictionaries and Sets',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-modules',
        title: 'Working with Modules',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-medical-data-validator',
        title: 'Build a Medical Data Validator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-dictionaries-and-sets',
        title: 'Dictionaries and Sets review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-dictionaries-and-sets',
        title: 'Dictionaries and Sets Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-user-configuration-manager',
        title: 'Build a User Configuration Manager',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-error-handling',
        title: 'Understanding Error Handling',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-isbn-validator',
        title: 'Debug an ISBN Validator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-error-handling',
        title: 'Error Handling Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-error-handling',
        title: 'Error Handling Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-classes-and-objects',
        title: 'Classes and Objects',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-musical-instrument-inventory',
        title: 'Build a Musical Instrument Inventory',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-planet-class',
        title: 'Build a Planet Class',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-email-simulator',
        title: 'Build an Email Simulator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-classes-and-objects',
        title: 'Classes and Objects Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-classes-and-objects',
        title: 'Classes and Objects Quiz',
        translated: false
      },
      // TODO: traduire en français
      { key: 'lab-budget-app', title: 'Build a Budget App', translated: false },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-object-oriented-programming-and-encapsulation',
        title: 'Understanding Object Oriented Programming and Encapsulation',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-salary-tracker',
        title: 'Build a Salary Tracker',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-game-character-stats',
        title: 'Build a Game Character Stats Tracker',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-inheritance-and-polymorphism',
        title: 'Understanding Inheritance and Polymorphism',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-media-catalogue',
        title: 'Build a Media Catalogue',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-abstraction',
        title: 'Understanding Abstraction',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-discount-calculator',
        title: 'Build a Discount Calculator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-player-interface',
        title: 'Build a Player Interface',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-object-oriented-programming',
        title: 'Object Oriented Programming Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-object-oriented-programming',
        title: 'Object Oriented Programming Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-polygon-area-calculator',
        title: 'Build a Polygon Area Calculator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-common-data-structures',
        title: 'Working with Common Data Structures',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-linked-list-class',
        title: 'Build a Linked List',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-data-structures',
        title: 'Data Structures Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-data-structures',
        title: 'Data Structures Quiz',
        translated: false
      },
      // TODO: traduire en français
      { key: 'lab-hash-table', title: 'Build a Hash Table', translated: false },
      // TODO: traduire en français
      {
        key: 'lecture-searching-and-sorting-algorithms',
        title: 'Searching and Sorting Algorithms',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-binary-search',
        title: 'Implement the Binary Search Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-bisection-method',
        title: 'Implement the Bisection Method',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-merge-sort',
        title: 'Implement the Merge Sort Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-quicksort',
        title: 'Implement the Quicksort Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-selection-sort',
        title: 'Implement the Selection Sort Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-luhn-algorithm',
        title: 'Implement the Luhn Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-searching-and-sorting-algorithms',
        title: 'Searching and Sorting Algorithms Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-searching-and-sorting-algorithms',
        title: 'Searching and Sorting Algorithms Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-tower-of-hanoi',
        title: 'Implement the Tower of Hanoi Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-graphs-and-trees',
        title: 'Understanding Graphs and Trees',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-shortest-path-algorithm',
        title: 'Implement the Shortest Path Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-adjacency-list-to-matrix-converter',
        title: 'Build an Adjacency List to Matrix Converter',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-breadth-first-search',
        title: 'Implement the Breadth-First Search Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-depth-first-search',
        title: 'Implement the Depth-First Search Algorithm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-n-queens-problem',
        title: 'Implement the N-Queens Problem',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-graphs-and-trees',
        title: 'Graphs and Trees Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-graphs-and-trees',
        title: 'Graphs and Trees Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-dynamic-programming',
        title: 'Understanding Dynamic Programming',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-nth-fibonacci-number',
        title: 'Build an Nth Fibonacci Number Calculator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-dynamic-programming',
        title: 'Dynamic Programming Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-dynamic-programming',
        title: 'Dynamic Programming Quiz',
        translated: false
      },
      // TODO: traduire en français
      { key: 'review-python', title: 'Python Review', translated: false },
      // TODO: traduire en français
      {
        key: 'exam-python-certification',
        title: 'Python Certification Exam',
        translated: false
      }
    ]
  },
  {
    key: 'relational-databases-v9',
    title: 'Bases de données relationnelles',
    subtitle: 'SQL, PostgreSQL et conception de schémas relationnels.',
    blocks: [
      // TODO: traduire en français
      {
        key: 'lecture-working-with-code-editors-and-ides',
        title: 'Working with Code Editors and IDEs',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-the-command-line-and-working-with-bash',
        title: 'Understanding the Command Line and Working with Bash',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-bash-boilerplate',
        title: 'Build a Boilerplate',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-bash-commands',
        title: 'Bash Commands Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-bash-commands',
        title: 'Bash Commands Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-relational-databases',
        title: 'Working with Relational Databases',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-database-of-video-game-characters',
        title: 'Build a Database of Video Game Characters',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-sql-and-postgresql',
        title: 'SQL and PostgreSQL Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-sql-and-postgresql',
        title: 'SQL and PostgreSQL Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-celestial-bodies-database',
        title: 'Build a Celestial Bodies Database',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-bash-scripting',
        title: 'Understanding Bash Scripting',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-bash-five-programs',
        title: 'Build Five Programs',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-bash-scripting',
        title: 'Bash Scripting Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-bash-scripting',
        title: 'Bash Scripting Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-sql',
        title: 'Working With SQL',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-sql-student-database-part-1',
        title: 'Build a Student Database: Part 1',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-sql-student-database-part-2',
        title: 'Build a Student Database: Part 2',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-kitty-ipsum-translator',
        title: 'Build a Kitty Ipsum Translator',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-bike-rental-shop',
        title: 'Build a Bike Rental Shop',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-bash-and-sql',
        title: 'Bash and SQL Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-bash-and-sql',
        title: 'Bash and SQL Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-world-cup-database',
        title: 'Build a World Cup Database',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-salon-appointment-scheduler',
        title: 'Build a Salon Appointment Scheduler',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-nano',
        title: 'Working With Nano',
        translated: false
      },
      // TODO: traduire en français
      { key: 'workshop-castle', title: 'Build a Castle', translated: false },
      // TODO: traduire en français
      {
        key: 'lecture-introduction-to-git-and-github',
        title: 'Introduction to Git and GitHub',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-code-reviews-branching-deployment-and-ci-cd',
        title: 'Working With Code Reviews, Branching, Deployment, and CI/CD',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'workshop-sql-reference-object',
        title: 'Build an SQL Reference Object',
        translated: false
      },
      // TODO: traduire en français
      { key: 'review-git', title: 'Git Review', translated: false },
      // TODO: traduire en français
      { key: 'quiz-git', title: 'Git Quiz', translated: false },
      // TODO: traduire en français
      {
        key: 'lab-periodic-table-database',
        title: 'Build a Periodic Table Database',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lab-number-guessing-game',
        title: 'Build a Number Guessing Game',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-relational-databases',
        title: 'Relational Databases Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'exam-relational-databases-certification',
        title: 'Relational Databases Certification Exam',
        translated: false
      }
    ]
  },
  {
    key: 'back-end-development-and-apis-v9',
    title: 'Back-End et APIs',
    subtitle: 'Node, Express, et construction d’APIs côté serveur.',
    blocks: [
      // TODO: traduire en français
      {
        key: 'lecture-working-with-nodejs-and-event-driven-architecture',
        title: 'Working with NodeJS and event driven architecture',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-node-js-intro',
        title: 'NodeJS Intro Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-node-js-intro',
        title: 'NodeJS Intro Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-node-core-modules',
        title: 'Working with Node Core Modules',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'review-node-js-core-modules',
        title: 'Node JS Core Modules Review',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'quiz-node-js-core-modules',
        title: 'NodeJS Core Modules Quiz',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-introduction-to-npm',
        title: 'Introduction to npm',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-npm-scripts',
        title: 'Working with npm Scripts',
        translated: false
      },
      // TODO: traduire en français
      { key: 'review-npm', title: 'NPM Review', translated: false },
      // TODO: traduire en français
      { key: 'quiz-npm', title: 'NPM Quiz', translated: false },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-how-http-dns-tcpip-work',
        title: 'Understanding how HTTP, DNS and TCP/IP work',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-the-http-request-response-model',
        title: 'Understanding the HTTP Request-Response Model',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-rest-api-and-web-services',
        title: 'Understanding the REST API and Web Services',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-working-with-express',
        title: 'Working with Express',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'lecture-understanding-routing-in-express-js',
        title: 'Understanding Routing in ExpressJS',
        translated: false
      },
      // TODO: traduire en français
      {
        key: 'exam-back-end-development-and-apis-certification',
        title: 'Back-End Development and APIs Certification Exam',
        translated: false
      }
    ]
  },
  {
    key: 'full-stack-developer-v9',
    title: 'Cursus Full-Stack',
    subtitle: 'Le grand cursus complet : front-end + back-end + déploiement.',
    blocks: [
      // TODO: traduire en français
      {
        key: 'exam-certified-full-stack-developer',
        title: 'Certified Full-Stack Developer Exam',
        translated: false
      }
    ]
  }
];

type View = { v: 'lang' } | { v: 'fr-home' } | { v: 'fr-cert'; cert: string };

function CoursFrPage({ data }: { data: PageData }): JSX.Element {
  const [view, setView] = useState<View>({ v: 'lang' });
  const dispatch = useDispatch();

  useEffect(() => {
    if (view.v !== 'fr-cert') return;

    const superBlock = view.cert as SuperBlocks;
    const initialBlock = data.allChallengeNode.nodes.find(
      ({ challenge }) =>
        challenge.superBlock === superBlock && isLocalChallenge(challenge)
    )?.challenge.block;

    dispatch(resetExpansion());
    if (initialBlock) dispatch(toggleBlock(initialBlock));
  }, [data.allChallengeNode.nodes, dispatch, view]);

  return (
    <LearnLayout>
      <SEO title='Cours en français' />
      <Container>
        <Row>
          <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
            <Spacer size='m' />

            {view.v === 'lang' && (
              <>
                <h1 className='cours-fr-title'>Choisis ton parcours</h1>
                <p className='cours-fr-intro'>
                  Ouvre les certifications françaises, le parcours complet ou le
                  catalogue filtré.
                </p>
                <div className='cours-fr-grid'>
                  <button
                    type='button'
                    className='cours-fr-folder-card'
                    onClick={() => setView({ v: 'fr-home' })}
                  >
                    <span className='cours-fr-folder-icon'>📁</span>
                    <span className='cours-fr-folder-label'>
                      Certifications françaises
                    </span>
                    <span className='cours-fr-folder-sub'>
                      Certifications françaises disponibles.
                    </span>
                  </button>
                  <a className='cours-fr-folder-card' href='/learn'>
                    <span className='cours-fr-folder-icon'>📁</span>
                    <span className='cours-fr-folder-label'>
                      Parcours complet
                    </span>
                    <span className='cours-fr-folder-sub'>
                      Tous les cours locaux, avec les traductions quand elles
                      existent.
                    </span>
                  </a>
                  <a className='cours-fr-folder-card' href='/catalog'>
                    <span className='cours-fr-folder-icon'>📁</span>
                    <span className='cours-fr-folder-label'>Catalogue</span>
                    <span className='cours-fr-folder-sub'>
                      Catalogue global avec les filtres du site.
                    </span>
                  </a>
                </div>
              </>
            )}

            {view.v === 'fr-home' && (
              <>
                <BackBar
                  onBack={() => setView({ v: 'lang' })}
                  crumbs={['Certifications françaises']}
                />
                <h1 className='cours-fr-title'>📁 Certifications françaises</h1>
                <p className='cours-fr-intro'>
                  Choisis une certification française, ou ouvre le catalogue
                  global pour utiliser tous les filtres du site.
                </p>

                <h2 className='cours-fr-section-title'>Catalogue global</h2>
                <div className='cours-fr-grid'>
                  <a className='cours-fr-folder-card' href='/catalog'>
                    <span className='cours-fr-folder-icon'>📁</span>
                    <span className='cours-fr-folder-label'>Catalogue</span>
                    <span className='cours-fr-folder-sub'>
                      Ouvre le catalogue complet avec les filtres globaux.
                    </span>
                  </a>
                </div>

                <h2 className='cours-fr-section-title'>Par certification</h2>
                <div className='cours-fr-grid'>
                  {CERTIFICATIONS.map(cert => {
                    const hasTranslatedContent = cert.blocks.some(
                      block => block.translated
                    );
                    return (
                      <button
                        key={cert.key}
                        type='button'
                        className='cours-fr-folder-card'
                        onClick={() =>
                          setView({ v: 'fr-cert', cert: cert.key })
                        }
                      >
                        <span className='cours-fr-folder-icon'>📁</span>
                        <span className='cours-fr-folder-label'>
                          {cert.title}
                        </span>
                        <span className='cours-fr-folder-sub'>
                          {cert.subtitle}
                        </span>
                        {!hasTranslatedContent ? (
                          <span className='cours-fr-not-translated'>
                            🚧 Traduction à venir
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {view.v === 'fr-cert' &&
              (() => {
                const cert = CERTIFICATIONS.find(c => c.key === view.cert);
                if (!cert) return <p>Certification introuvable.</p>;
                const superBlock = cert.key as SuperBlocks;
                const structure = data.allSuperBlockStructure.nodes.find(
                  node => node.superBlock === superBlock
                );
                const superBlockChallenges = data.allChallengeNode.nodes
                  .map(({ challenge }) => challenge)
                  .filter(
                    challenge =>
                      challenge.superBlock === superBlock &&
                      isLocalChallenge(challenge)
                  );
                return (
                  <>
                    <BackBar
                      onBack={() => setView({ v: 'fr-home' })}
                      crumbs={['Français', cert.title]}
                    />
                    <h1 className='cours-fr-title text-center'>Cours</h1>
                    <p className='cours-fr-intro cours-fr-cert-note'>
                      {cert.title} — architecture officielle freeCodeCamp. Les
                      dossiers incompatibles avec le mode local sont masqués.
                      Les autres restent disponibles selon leur état de
                      traduction.
                    </p>
                    {cert.overview && (
                      <section className='cours-fr-cert-overview'>
                        <p className='cours-fr-cert-cta'>{cert.overview.cta}</p>
                        {cert.overview.paragraphs.map(paragraph => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                        <p>
                          <strong>{cert.overview.requirementsTitle}</strong>
                        </p>
                        <ul>
                          {cert.overview.requirements.map(requirement => (
                            <li key={requirement}>{requirement}</li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {!structure ? (
                      <div className='cours-fr-empty'>
                        🚧 Structure de certification introuvable.
                      </div>
                    ) : (
                      <div className='cours-fr-cert-map'>
                        <SuperBlockAccordion
                          challenges={superBlockChallenges}
                          superBlock={superBlock}
                          structure={structure}
                          chosenBlock={superBlockChallenges[0]?.block ?? ''}
                          completedChallengeIds={[]}
                        />
                      </div>
                    )}
                  </>
                );
              })()}

            <Spacer size='l' />
          </Col>
        </Row>
      </Container>
    </LearnLayout>
  );
}

function BackBar({ onBack, crumbs }: { onBack: () => void; crumbs: string[] }) {
  return (
    <div className='cours-fr-backbar'>
      <button type='button' className='cours-fr-back-btn' onClick={onBack}>
        ← Retour
      </button>
      <span className='cours-fr-crumbs'>{crumbs.join(' / ')}</span>
    </div>
  );
}

CoursFrPage.displayName = 'CoursFrPage';
export default CoursFrPage;

export const query = graphql`
  query CoursFrQuery {
    allChallengeNode(
      sort: [
        { challenge: { superOrder: ASC } }
        { challenge: { order: ASC } }
        { challenge: { challengeOrder: ASC } }
      ]
    ) {
      nodes {
        challenge {
          id
          title
          block
          blockLabel
          blockLayout
          challengeOrder
          challengeType
          dashedName
          order
          superBlock
          description
          fields {
            slug
          }
        }
      }
    }
    allSuperBlockStructure {
      nodes {
        superBlock
        chapters {
          dashedName
          comingSoon
          modules {
            dashedName
            comingSoon
            moduleType
            blocks
          }
        }
      }
    }
  }
`;
