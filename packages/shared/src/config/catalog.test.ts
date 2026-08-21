import { describe, it, expect } from 'vitest';
import { catalog } from './catalog';
import { SuperBlocks, superBlockStages, SuperBlockStage } from './curriculum';

describe('catalog', () => {
  it('lists the local FR fork v9 certifications', () => {
    expect(catalog.map(course => course.superBlock.toString()).sort()).toEqual(
      [
        SuperBlocks.BackEndDevApisV9,
        SuperBlocks.FrontEndDevLibsV9,
        SuperBlocks.FullStackDeveloperV9,
        SuperBlocks.JsV9,
        SuperBlocks.PythonV9,
        SuperBlocks.RelationalDbV9,
        SuperBlocks.RespWebDesignV9
      ]
        .map(sb => sb.toString())
        .sort()
    );
  });

  it('covers every core v9 superblock from the learn map', () => {
    const core = superBlockStages[SuperBlockStage.Core].map(sb =>
      sb.toString()
    );
    expect(catalog.map(course => course.superBlock.toString()).sort()).toEqual(
      [...core].sort()
    );
  });
});
