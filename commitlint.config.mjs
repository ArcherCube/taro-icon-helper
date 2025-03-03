/** 允许的 commit 类型 */
const commitTypes = {
  feat: {
    desc: '新功能',
  },
  fix: {
    desc: '问题修复',
  },
  docs: {
    desc: '文档注释',
  },
  style: {
    desc: '代码格式（不影响代码运行的变动）',
  },
  refactor: {
    desc: '重构、优化（既不增加新功能，也不是修复bug）',
  },
  chore: {
    desc: '构建过程或辅助工具的变动',
  },
  perf: {
    desc: '性能优化',
  },
  demo: {
    desc: '示例',
  },
  revert: {
    desc: '回退',
  },
  build: {
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
    types: Object.entries(commitTypes).map(([key, item]) => ({
      value: key,
      name: `${key}: ${' '.repeat(maxCommitTypeLength - key.length)}${item.desc}`,
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
