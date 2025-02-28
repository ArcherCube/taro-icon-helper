import fs from 'fs-extra';
import path from 'path';
import { Config } from '../type/config';
import { currentPath, progressBarController } from '../constant';
import { createExportIndex } from './create-export-index';
import { generateComponents } from './generate-components';
import { generateFonts } from './generate-fonts';

export const updateIcon = async (config: Config) => {
  console.time('执行时间');
  const rootPath = path.resolve(currentPath, config.outputDir);

  if (!(await fs.exists(rootPath))) {
    await fs.mkdir(rootPath, {});
  }

  await Promise.all([
    // 生成字体
    generateFonts(config),
    // 生产组件
    generateComponents(config),
    // 创建导出index文件
    createExportIndex(config),
  ]);

  progressBarController.stop();
  console.timeEnd('执行时间');
};
