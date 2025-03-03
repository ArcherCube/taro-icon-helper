import fs from 'fs-extra';

export const writeFile = (filePath: string, content: string) => {
  return fs.writeFile(filePath, content, {
    encoding: 'utf-8',
    flag: 'w+',
  });
};
