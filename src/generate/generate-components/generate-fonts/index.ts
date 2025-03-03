import svgToFont from 'svgtofont';

type generateFontsParams = {
  outputDir: string;
  classNamePrefix: string;
  sourceDir: string;
  fontName: string;
};

export const generateFonts = ({ sourceDir, outputDir, classNamePrefix, fontName }: generateFontsParams) => {
  return svgToFont({
    src: sourceDir,
    dist: outputDir,
    emptyDist: true,
    fontName,
    classNamePrefix,
    css: {
      include: /\.css/,
      fontSize: 'inherit',
    },
    log: false,
    svgoOptions: {
      multipass: true,
      plugins: [
        { name: 'convertShapeToPath', params: { convertArcs: true } }, // 将形状转换为路径
        { name: 'removeViewBox' }, // 可选：保留 viewBox
        { name: 'removeTitle' }, // 可选：移除 <title> 标签
        { name: 'removeDimensions' }, // 可选：移除宽度和高度属性
      ],
    },
    svgicons2svgfont: {
      fixedWidth: true,
      fontHeight: 9999,
      normalize: true,
      centerHorizontally: true,
      centerVertically: true,
      // descent: 7,
    },
    excludeFormat: ['svg', 'symbol.svg', 'eot'],
  });
};
