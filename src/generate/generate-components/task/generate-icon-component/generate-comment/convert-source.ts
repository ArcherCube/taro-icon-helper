type ConvertSvgSourceOptions = {
  color: string[] | string;
  size?: {
    width: number;
    height: number;
  };
};

type PathAttribute = {
  stroke?: string;
  fill?: string;
};

type SVGAttribute = {
  xmlns?: string;
  width?: string;
  height?: string;
} & PathAttribute;

const SVG_ATTRIBUTE_REGEXP = /(?<=\<svg )[^\>]*(?=\>)/g;
const PATH_ATTRIBUTE_REGEXP = /(?<=\<path )[^\>\/]*(?=\/?\>)/g;

const stringToAttribute = (input: string) => {
  return input
    .trim()
    .split(/(?<=\") /)
    .map((attributeExp) => attributeExp.split('='))
    .reduce(
      (result, current) => {
        const [key, wrapValue] = current;
        const value = wrapValue.slice(1, wrapValue.length - 1);
        if (key && value) {
          result[key] = `${value}`;
        }
        return result;
      },
      {} as Record<string, string>,
    );
};

const attributeToString = (attribute: Record<string, string>) => {
  return Object.entries(attribute)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
};

const isVisibleColor = (color: string) => {
  return !['none', 'transparent'].includes(color);
};

export const convertSvgSource = (source: string, option: ConvertSvgSourceOptions) => {
  let result = source;
  let svgAttribute: SVGAttribute;

  // svg附加size
  result = result.replaceAll(SVG_ATTRIBUTE_REGEXP, (attributeStr) => {
    svgAttribute = stringToAttribute(attributeStr) as SVGAttribute;

    if (option.size) {
      svgAttribute.width = `${option.size.width}`;
      svgAttribute.height = `${option.size.height}`;
    }

    return attributeToString({
      ...svgAttribute,
      // 去除stroke和fill，由每个path去设置
      stroke: 'none',
      fill: 'none',
    });
  });

  // path 按顺序修改stroke和fill
  let pathIndex = 0;
  const color = typeof option.color === 'string' ? [option.color] : option.color;
  result = result.replaceAll(PATH_ATTRIBUTE_REGEXP, (attributeStr) => {
    const pathAttribute = stringToAttribute(attributeStr) as PathAttribute;

    const currentColor = color[pathIndex++ % color.length];

    if (pathAttribute.fill) {
      if (isVisibleColor(pathAttribute.fill)) {
        pathAttribute.fill = `${currentColor}`;
      }
    } else {
      // path的fill为空时，若svg的fill为空（即默认的black）或有可见的颜色，则path也为这个颜色
      if (!svgAttribute.fill || isVisibleColor(svgAttribute.fill)) {
        pathAttribute.fill = `${currentColor}`;
      }
    }
    if (pathAttribute.stroke && isVisibleColor(pathAttribute.stroke)) {
      pathAttribute.stroke = `${currentColor}`;
    }

    return attributeToString(pathAttribute);
  });

  return result;
};
