import fs from 'fs-extra';
import path from 'path';
import { Config } from '../../../type/config';
import {
  componentsDir,
  componentsTemplateDir,
  componentsTemplateStyleDir,
  currentPath,
  fontIconTemplateDir,
  svgIconTemplateDir,
} from '../../../constant';
import { writeFile } from '../../utils/write-file';
import { codeLines as fontIconComponentCodeLines } from './template/components/font-icon';
import { codeLines as styleImportCodeLines } from './template/components/style';
import { codeLines as styleDefineCodeLines } from './template/components/style/icon';
import { codeLines as svgIconComponentCodeLines } from './template/components/svg-icon';
import { codeLines as svgIconComponentConvertSourceCodeLines } from './template/components/svg-icon/convert-source';
import { codeLines as svgIconComponentSvg64CodeLines } from './template/components/svg-icon/svg64';

export const createBaseComponents = async ({ outputDir, className }: Config) => {
  const baseComponentsRootDir = path.resolve(currentPath, outputDir, componentsDir, componentsTemplateDir);

  await fs.mkdir(baseComponentsRootDir);

  const styleImportCodePromise = (async () => {
    const styleDir = path.resolve(baseComponentsRootDir, componentsTemplateStyleDir);
    await fs.mkdir(styleDir);

    await Promise.all([
      writeFile(path.resolve(styleDir, 'icon.css'), styleDefineCodeLines(className).join('\n')),
      writeFile(path.resolve(styleDir, 'index.ts'), styleImportCodeLines().join('\n')),
    ]);
  })();

  const fontIconComponentCodePromise = (async () => {
    const componentDir = path.resolve(baseComponentsRootDir, fontIconTemplateDir);

    await fs.mkdir(componentDir);

    await writeFile(path.resolve(componentDir, 'index.tsx'), fontIconComponentCodeLines(className).join('\n'));
  })();

  const svgIconComponentCodePromise = (async () => {
    const componentDir = path.resolve(baseComponentsRootDir, svgIconTemplateDir);

    await fs.mkdir(componentDir);

    await Promise.all([
      writeFile(path.resolve(componentDir, 'index.tsx'), svgIconComponentCodeLines(className).join('\n')),
      writeFile(path.resolve(componentDir, 'convert-source.ts'), svgIconComponentConvertSourceCodeLines().join('\n')),
      writeFile(path.resolve(componentDir, 'svg64.ts'), svgIconComponentSvg64CodeLines().join('\n')),
    ]);
  })();

  await Promise.all([styleImportCodePromise, fontIconComponentCodePromise, svgIconComponentCodePromise]);
};
