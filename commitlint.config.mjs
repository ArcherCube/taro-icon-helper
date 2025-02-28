/** 允许的 commit 类型 */
const commitTypes = {
  feat: {
    name: 'feat',
    desc: '新功能',
  },
  fix: {
    name: 'fix',
    desc: '问题修复',
  },
  docs: {
    name: 'docs',
    desc: '文档注释',
  },
  style: {
    name: 'style',
    desc: '代码格式（不影响代码运行的变动）',
  },
  refactor: {
    name: 'refactor',
    desc: '重构、优化（既不增加新功能，也不是修复bug）',
  },
  chore: {
    name: 'chore',
    desc: '构建过程或辅助工具的变动',
  },
  perf: {
    name: 'perf',
    desc: '性能优化',
  },
  demo: {
    name: 'demo',
    desc: '示例',
  },
  revert: {
    name: 'revert',
    desc: '回退',
  },
  build: {
    name: 'build',
    desc: '打包',
  },
};
/** 最长的 commitType 的名字，方便后续生成 prompt 时不用重复计算 */
const maxCommitTypeLength = Math.max(...Object.keys(commitTypes).map((type) => type.length));

/** @type {import('cz-git').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  // 详见：https://commitlint.js.org/reference/configuration.html#rules
  rules: {
    'type-enum': [2, 'always', Object.keys(commitTypes)],
  },
  prompt: {
    alias: { fd: 'docs: fix typos' },
    messages: {
      type: '请选择提交的类型：',
      scope: '请选择本次提交涉及的范围：',
      subject: '请输入本次提交的主题：',
      body: '请输入本次提交的详细描述（可使用 "|" 来分行）：',
      breaking: '请输入本次的破坏性改动（可使用 "|" 来分行）：',
      confirmCommit: '确定使用以上内容进行提交吗？',
    },
    skipQuestions: ['footerPrefix', 'footer'],
    types: Object.values(commitTypes).map((item) => ({
      value: item.name,
      name: `${item.name}: ${' '.repeat(maxCommitTypeLength - item.name.length)}${item.desc}`,
    })),
    allowCustomScopes: false,
    allowEmptyScopes: true,
    emptyScopesAlias: '空',
    markBreakingChangeMode: false,
    allowBreakingChanges: ['feat', 'fix'],
    breaklineNumber: 100,
    breaklineChar: '|',
    confirmColorize: true,
  },
};
