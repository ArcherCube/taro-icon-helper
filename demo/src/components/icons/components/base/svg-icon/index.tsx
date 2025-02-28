import { Image, View, ViewProps } from '@tarojs/components';
import { useMemo } from 'react';
import { convertSvgSource } from './convert-source';
import svg64 from './svg64';
import '../style';

export type IconProps = {
  type: string;
  /** 图标颜色。支持多色 */
  color?: string | string[];
} & Omit<ViewProps, 'children'>;

export const Icon = (props: IconProps) => {
  const { type: svgSource, color, className, ...otherProps } = props;

  const svgBase64 = useMemo(() => {
    return svg64(
      convertSvgSource(svgSource, {
        // props未定义color时，默认使用currentColor
        color: color || 'transparent',
      }),
    );
  }, [svgSource, color]);

  return (
    <View
      className={`my-icon ${className}`}
      // @ts-ignore next-line
      alt='icon'
      {...otherProps}
    >
      <Image
        src={svgBase64}
        style={{ width: '1em', height: '1em' }}
        mode='scaleToFill'
      />
    </View>
  );
};