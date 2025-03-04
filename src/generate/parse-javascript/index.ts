import { currentPath } from '@/constant';
import { Config } from '@/type/config';
import { writeFile } from '@/utils/write-file';
import babel from '@babel/core';
import fs from 'fs-extra';
import path from 'path';

export const parseJavascript = async (config: Config) => {
  const { outputDir } = config;
  const outputDirPath = path.resolve(currentPath, outputDir);

  const filenames = await fs.readdir(outputDirPath, { recursive: true, encoding: 'utf-8' });

  const tasks = filenames
    .filter((filename) => filename.endsWith('.ts') || filename.endsWith('.tsx'))
    .map(async (filename) => {
      const filePath = path.resolve(outputDirPath, filename);
      const babelResult = await babel.transformFileAsync(filePath, {
        presets: [['@babel/preset-typescript', { isTSX: true, allExtensions: true }]],
      });

      if (babelResult?.code) {
        const splitIndex = filename.lastIndexOf('.');
        const pureFilename = filename.slice(0, splitIndex);
        const suffix = filename.slice(splitIndex);

        await writeFile(
          path.resolve(outputDirPath, `${pureFilename}${suffix === '.ts' ? '.js' : '.jsx'}`),
          babelResult.code,
        );
        await fs.remove(filePath);
      } else {
        console.warn(`error when parse ${filePath}`);
      }
    });

  await Promise.all(tasks);
};
