export type Config = {
  /** svg源文件夹 */
  sourceDir: string;
  /** 输出文件夹 */
  outputDir: string;
  /** 图标组件基础样式名。会同时作为图标字体css class前缀 */
  className: string;
  /** 字体名 */
  fontName: string;
  /** 是否为typescript。默认为true。 */
  typescript?: boolean;
};
