import { exec } from 'child_process';
import path from 'path';
import fs from 'fs-extra';

/** 执行cli命令，返回promise */
export const execCommand = (command: string) => {
  return new Promise<string>((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        reject(new Error(`[Error]: ${error}`));
        return;
      }

      resolve(stdout.trim());
    });
  });
};

/** 获取最新的tag */
export const getLatestTag = async () => {
  return await execCommand(`git tag | grep '^[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+' | sort -V | tail -n 1`);
};

/** 获取当前 branch */
export const getCurrentBranch = async () => {
  return await execCommand(`git branch --show-current`);
};

/** 获取未提交的变更 */
export const getUncommitChanges = async () => {
  return await execCommand(`git diff HEAD`);
};

// 获取从当前到上个tag的提交记录
export const getDiffCommits = async () => {
  const latestTag = await getLatestTag();
  const commits = (await execCommand(`git log ${latestTag}..HEAD --pretty=format:"%s"`))
    .split('\n')
    .map((commit) => {
      const [_, type, message] = commit.match(/^(\w+): (.*)$/) ?? [];

      if (type && message) {
        return {
          type,
          message,
        };
      }
      return undefined;
    })
    .filter((commit) => !!commit);

  return commits;
};

type PackageJson = {
  version?: string;
  [x: string]: string | undefined;
};

export const getPackageJson = async () => {
  // @ts-ignore
  const __dirname = path.resolve(import.meta.url.slice('file://'.length), '..');

  // 解析 package.json
  const packageJsonPath = path.join(__dirname, '../package.json');
  const packageJsonSource = await fs.readFile(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonSource) as PackageJson;

  return {
    packageJson,
    jsonFilePath: packageJsonPath,
  };
};
