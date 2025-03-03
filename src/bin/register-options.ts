import { Command } from 'commander';

export type CliOptionParam = {
  name: string;
  required?: boolean;
};

export type CliOption = {
  name: string;
  shortcut: string;
  params: CliOptionParam[];
  description: string;
};

export type InputOptions<T extends CliOption[]> = Record<T[number]['name'], string>;

export const registerOptions = (command: Command, options: CliOption[]) => {
  options.forEach((option) => {
    const paramList = option.params
      .map((param) => {
        return param.required ? `<${param.name}>` : `[${param.name}]`;
      })
      .join(' ');
    command.option(`-${option.shortcut}, --${option.name}${paramList ? ` ${paramList}` : ''}`, option.description);
  });
};
