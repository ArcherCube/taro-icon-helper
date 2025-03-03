import { componentsDir, cpus, currentPath, tempDir, fontsDir, progressBarController } from '@/constant';
import { Config } from '@/type/config';
import { writeFile } from '@/utils/write-file';
import fs from 'fs-extra';
import * as path from 'path';
import { Piscina } from 'piscina';
import { createBaseComponents } from './create-base-components';
import { TaskParams } from './task';
import { generateFonts } from './generate-fonts';

// @ts-ignore
const currentFilePath = import.meta.url.slice('file://'.length);
const generateTask = new Piscina<TaskParams>({
  filename: path.resolve(currentFilePath, '../task/index.js'),
  minThreads: cpus.length / 2,
  maxThreads: cpus.length / 2,
});

const parseCamelCase = (origin: string) => {
  return origin
    .toLocaleLowerCase()
    .replaceAll(/[\\/ _-][a-zA-Z]/g, (match) => match.slice(1).toLocaleUpperCase())
    .replace(/[a-zA-Z]/, (char) => char.toLocaleUpperCase());
};

export const generateComponents = async (config: Config) => {
  const { sourceDir, outputDir, className, fontName } = config;

  const svgSourceDir = path.resolve(currentPath, sourceDir);

  const filenames = (await fs.readdir(svgSourceDir, { encoding: 'utf-8' })).filter((filename) => {
    const splitIndex = filename.lastIndexOf('.');
    const suffix = filename.slice(splitIndex);

    return suffix === '.svg';
  });

  const svgCount = filenames.length;
  const totalTaskCount = svgCount + 1;
  const progressBar = progressBarController.create(totalTaskCount, 0);

  const fixedSvgDir = fs.mkdtempSync(path.resolve(tempDir, 'icons-cli-svg-fixed-'), { encoding: 'utf-8' });
  const componentsRootDir = path.resolve(currentPath, outputDir, componentsDir);

  // 清理目录
  progressBar.update({ current: '清理目录...' });
  await fs.remove(componentsRootDir);
  await fs.mkdir(componentsRootDir);

  // 生成基础组件
  progressBar.update({ current: '生成基础组件...' });
  await createBaseComponents(config);

  const componentIndexCodeArr: string[] = [];
  let finishCount = 0;
  const tasks = filenames.map(async (filename) => {
    const splitIndex = filename.lastIndexOf('.');
    const iconName = filename.slice(0, splitIndex);
    const iconNameCamelCase = parseCamelCase(iconName);

    componentIndexCodeArr.push(`export { ${iconNameCamelCase} } from './${iconName}';`);

    progressBar.update({ current: `生成图标组件（${finishCount}/${svgCount}）` });
    await generateTask.run({
      svgSourceDir,
      componentsRootDir,
      iconNameCamelCase,
      filename,
      className,
      iconName,
      fixedSvgDir,
    });

    ++finishCount;
    progressBar.increment(1, { current: `生成图标组件（${finishCount}/${svgCount}）` });
  });

  await Promise.all(tasks);

  await writeFile(path.resolve(componentsRootDir, 'index.ts'), componentIndexCodeArr.join('\n'));

  progressBar.update({ current: `生成字体...` });
  await generateFonts({
    sourceDir: fixedSvgDir,
    outputDir: path.resolve(currentPath, outputDir, fontsDir),
    fontName,
    classNamePrefix: className,
  });

  progressBar.update(totalTaskCount, { current: `已生成 ${svgCount} 个组件` });

  await fs.remove(fixedSvgDir);
};
