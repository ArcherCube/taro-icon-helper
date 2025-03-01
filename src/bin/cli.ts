#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { currentPath } from '../constant';
import { updateIcon } from '../update';

const program = new Command();

const CONFIG_FILE_NAME = 'icon-helper.json';

program.command('update').action(async () => {
  const configFilePath = path.resolve(currentPath, `./${CONFIG_FILE_NAME}`);

  const isConfigFileExist = await fs.exists(configFilePath);

  if (isConfigFileExist) {
    const configSource = await fs.readFile(configFilePath, { encoding: 'utf8' });

    const config = JSON.parse(configSource);

    await updateIcon(config);
  } else {
    throw new Error(`在 ${currentPath} 找不到 ${CONFIG_FILE_NAME}，请检查配置文件及执行路径。`);
  }
});

program.parse();
