import inquirer from 'inquirer';
import { execCommand, getCurrentBranch, getDiffCommits, getPackageJson, getUncommitChanges } from './util';
import { MAIN_BRANCH_NAME, NPM_REGISTRY } from './constant';

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

  const diffCommits = await getDiffCommits();

  if (diffCommits.length) {
    // 整理变更的内容
    const changelog = diffCommits.map((commit) => `${commit.type}: ${commit.message}`).join('\n');

    throw `your have commits which is not release：\n${changelog}\n\nplease release all your commits before publish.\n`;
  }

  const lastTag = await execCommand(`git tag | grep '^[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+' | sort -V | tail -n 1`);

  const message = await execCommand(`git tag -l --format='%(contents)' ${lastTag}`);

  const { packageJson } = await getPackageJson();

  const oldRegistry = await execCommand('npm get registry');
  await execCommand(`npm set registry ${NPM_REGISTRY}`);
  try {
    const username = await execCommand(`npm whoami`);

    const question = `you are about to publish ${packageJson.version} as ${username}\n\n${message}\n\nconfirm to publish?`;
    const answer = await inquirer.prompt([{ type: 'confirm', name: 'isConfirm', message: question }]);
    if (!answer.isConfirm) {
      return;
    }

    await execCommand(`npm publish`);
  } catch (e) {
    console.error(e);
  } finally {
    await execCommand(`npm set registry ${oldRegistry}`);
  }
})().catch((e) => {
  console.error(e);
});
