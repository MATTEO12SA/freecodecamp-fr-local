import { SuperBlocks } from './curriculum';

enum Levels {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced'
}

enum Topic {
  Html = 'html',
  CSS = 'css',
  Js = 'js',
  React = 'react',
  Python = 'python',
  DataAnalysis = 'data-analysis',
  MachineLearning = 'machine-learning',
  D3 = 'd3',
  Api = 'api',
  InformationSecurity = 'information-security',
  ComputerFundamentals = 'computer-fundamentals',
  ComputerScience = 'computer-science',
  Math = 'math',
  Databases = 'databases',
  Bash = 'bash',
  Git = 'git',
  Editors = 'editors',
  AI = 'ai'
}

interface Catalog {
  superBlock: SuperBlocks;
  level: Levels;
  hours: number;
  topic: Topic;
}

/**
 * Fork FR local: vitrine catalogue = certifications v9 du parcours local.
 * Les micro-cours upstream restent accessibles via /learn.
 */
export const catalog: Catalog[] = [
  {
    superBlock: SuperBlocks.RespWebDesignV9,
    level: Levels.Beginner,
    hours: 300,
    topic: Topic.Html
  },
  {
    superBlock: SuperBlocks.JsV9,
    level: Levels.Intermediate,
    hours: 300,
    topic: Topic.Js
  },
  {
    superBlock: SuperBlocks.FrontEndDevLibsV9,
    level: Levels.Intermediate,
    hours: 300,
    topic: Topic.React
  },
  {
    superBlock: SuperBlocks.BackEndDevApisV9,
    level: Levels.Intermediate,
    hours: 300,
    topic: Topic.Api
  },
  {
    superBlock: SuperBlocks.PythonV9,
    level: Levels.Intermediate,
    hours: 300,
    topic: Topic.Python
  },
  {
    superBlock: SuperBlocks.RelationalDbV9,
    level: Levels.Intermediate,
    hours: 300,
    topic: Topic.Databases
  },
  {
    superBlock: SuperBlocks.FullStackDeveloperV9,
    level: Levels.Advanced,
    hours: 300,
    topic: Topic.ComputerScience
  }
];
