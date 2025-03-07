import { currentPath, progressBarController } from '@/constant';
import { Config } from '@/type/config';
import fs from 'fs-extra';
import path from 'path';
import { createExportIndex } from './create-export-index';
import { generateComponents } from './generate-components';
import { parseJavascript } from './parse-javascript';

export const generate = async (config: Config) => {
  console.time('执行时间');
  const rootPath = path.resolve(currentPath, config.outputDir);

  // 清理目录
  await fs.remove(rootPath);
  await fs.mkdir(rootPath, {});

  await Promise.all([
    // 生成组件
    generateComponents(config),
    // 创建导出index文件
    createExportIndex(config),
  ]);

  if (config.typescript === false) {
    await parseJavascript(config);
  }

  progressBarController.stop();
  console.timeEnd('执行时间');
};
