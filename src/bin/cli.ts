#!/usr/bin/env node

import { currentPath } from '@/constant';
import { generate } from '@/generate';
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { CliOption, type InputOptions, registerOptions } from './register-options';

const program = new Command();

// -------------------------------------------- update --------------------------------------------
(() => {
  const CONFIG_FILE_NAME = 'icon-helper.json';

  const UPDATE_OPTIONS = [
    {
      name: 'config' as const,
      params: [{ name: 'configFilePath', required: true }],
      shortcut: 'c',
      description: '指定配置文件',
    },
  ] satisfies CliOption[];

  const updateCommand = program.command('update');
  registerOptions(updateCommand, UPDATE_OPTIONS);

  updateCommand.action(async (options: InputOptions<typeof UPDATE_OPTIONS>) => {
    let configFilePath = path.resolve(currentPath, `./${CONFIG_FILE_NAME}`);
    if (options.config) {
      if (path.isAbsolute(options.config)) {
        configFilePath = options.config;
      } else {
        configFilePath = path.resolve(currentPath, options.config);
      }
    }

    const isConfigFileExist = await fs.exists(configFilePath);

    if (isConfigFileExist) {
      const configSource = await fs.readFile(configFilePath, { encoding: 'utf8' });

      const config = JSON.parse(configSource);

      await generate(config);
    } else {
      throw new Error(`找不到 ${configFilePath}，请检查配置文件及执行路径。`);
    }
  });
})();

program.parse();
