import fs from 'fs-extra';
import inquirer from 'inquirer';
import * as os from 'os';
import path from 'path';
import { execCommand, getCurrentBranch, getDiffCommits, getPackageJson, getUncommitChanges } from './util';
import { MAIN_BRANCH_NAME } from './constant';

const CHANGE_LOG_COMMIT_TYPE = ['feat', 'fix', 'refactor', 'perf'];
const BUMP_TYPE_ENUM = ['major', 'minor', 'patch'] as const;

(async () => {
  // 检查未提交的变更
  const uncommitChange = await getUncommitChanges();
  if (uncommitChange) {
    throw 'you have uncommitted changes, please commit before release.\n';
  }

  const currentBranch = await getCurrentBranch();
  if (currentBranch !== MAIN_BRANCH_NAME) {
    throw `you are not in main branch.\n`;
  }

  // 整理bumpType
  let bumpType = process.argv[2] as (typeof BUMP_TYPE_ENUM)[number];
  if (!bumpType || !BUMP_TYPE_ENUM.includes(bumpType)) {
    await inquirer
      .prompt([{ type: 'list', name: 'bumpType', message: 'choose your bump type:', choices: BUMP_TYPE_ENUM }])
      .then((answer) => {
        bumpType = answer.bumpType;
      });
  }
  const bumpTypeIndex = BUMP_TYPE_ENUM.indexOf(bumpType);

  // 获取到目前为止差异的commit
  const commits = await getDiffCommits();

  // 整理变更的内容
  const changeLog = commits
    .filter((commit) => CHANGE_LOG_COMMIT_TYPE.includes(commit.type))
    .map((commit) => `${commit.type}: ${commit.message}`)
    .join('\n');

  // 获取package.json
  const { packageJson, jsonFilePath } = await getPackageJson();
  if (!packageJson.version) {
    throw 'version is undefined';
  }

  // 生成新版本号
  const newVersion = packageJson.version
    .split('.')
    .map((num, index) => {
      if (index === bumpTypeIndex) {
        return Number(num) + 1;
      }
      if (index > bumpTypeIndex) {
        return 0;
      }
      return Number(num);
    })
    .join('.');

  // 确认是否提交
  const answer = await inquirer.prompt([
    {
      name: 'isConfirm',
      type: 'confirm',
      message: `you are about to release ${newVersion}\n\nchangelog: \n${'-'.repeat(30)}\n${changeLog}\n${'-'.repeat(30)}\n\nconfirm to release?`,
    },
  ]);
  if (!answer.isConfirm) {
    return;
  }

  // 更新package.json
  const newPackageJson = {
    ...packageJson,
    version: newVersion,
  };
  await fs.writeFile(jsonFilePath, `${JSON.stringify(newPackageJson, null, 2)}\n`, 'utf8');

  // 暂存package.json
  await execCommand('git add .');

  // 需要用临时文件来保存message，避免引号一类的问题
  const tempCommitMessageDir = await fs.mkdtemp(
    path.resolve(os.tmpdir(), 'taro-icon-helper-release-message-'),
    'utf-8',
  );

  try {
    const commitMessage = `release: version ${newVersion}\n\nChangelog:\n${changeLog}`;
    const tempCommitMessageFilePath = path.resolve(tempCommitMessageDir, 'message.txt');
    await fs.writeFile(tempCommitMessageFilePath, commitMessage);

    // git commit
    await execCommand(`git commit -F ${tempCommitMessageFilePath}`);

    // git tag
    await execCommand(`git tag -a ${newVersion} -F ${tempCommitMessageFilePath}`);

    console.log(`Version updated to ${newVersion}`);
  } catch (e) {
    // 删除临时文件
    await fs.remove(tempCommitMessageDir);

    // 丢给外面统一处理
    throw e;
  }
})().catch((e) => {
  console.error(e);
});
