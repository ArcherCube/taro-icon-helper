import { writeFile } from '@/utils/write-file';
import SvgFixer from './svg-fixer';

type FixSvgParams = {
  svgSourcePath: string;
  outputFilePath: string;
  resolution?: number;
};

export const fixSvg = async (params: FixSvgParams) => {
  const { svgSourcePath, outputFilePath, resolution = 1024 } = params;

  const fixer = new SvgFixer(svgSourcePath, resolution);

  const result = await fixer.process();

  await writeFile(outputFilePath, result);
};
