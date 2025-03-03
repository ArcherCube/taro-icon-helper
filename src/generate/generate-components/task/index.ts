import { generateIconComponent } from './generate-icon-component';
import { fixSvg } from './fix-svg';
import path from 'path';

export type TaskParams = {
  resolution?: number;
  svgSourceDir: string;
  fixedSvgDir: string;
  componentsRootDir: string;
  iconNameCamelCase: string;
  filename: string;
  className: string;
  iconName: string;
};

export default async (params: TaskParams) => {
  const svgSourcePath = path.resolve(params.svgSourceDir, params.filename);
  await Promise.all([
    fixSvg({
      svgSourcePath,
      outputFilePath: path.resolve(params.fixedSvgDir, params.filename),
      resolution: params.resolution,
    }),
    generateIconComponent({
      svgSourcePath,
      iconName: params.iconName,
      className: params.className,
      filename: params.filename,
      iconNameCamelCase: params.iconNameCamelCase,
      componentsRootDir: params.componentsRootDir,
    }),
  ]);
};
