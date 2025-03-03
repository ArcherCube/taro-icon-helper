import { currentPath, progressBarController } from '@/constant';
import { Config } from '@/type/config';
import fs from 'fs-extra';
import path from 'path';
import { createExportIndex } from './create-export-index';
import { generateComponents } from './generate-components';

export const generate = async (config: Config) => {
  console.time('执行时间');
  const rootPath = path.resolve(currentPath, config.outputDir);

  if (!(await fs.exists(rootPath))) {
    await fs.mkdir(rootPath, {});
  }

  await Promise.all([
    // 生成组件
    generateComponents(config),
    // 创建导出index文件
    createExportIndex(config),
  ]);

  progressBarController.stop();
  console.timeEnd('执行时间');
};
