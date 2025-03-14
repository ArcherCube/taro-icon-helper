import { Icon as SvgIcon } from './base/svg-icon';
import { Icon as FontIcon } from './base/font-icon';
import svgSource from '../../../assets/svg/up-filled.svg';
export type UpFilledProps = Omit<React.ComponentProps<typeof SvgIcon> & React.ComponentProps<typeof FontIcon>, 'type'>;
/**
 * ![up-filled.svg](data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDggNDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBzdHJva2U9Im5vbmUiPjxwYXRoIGRhdGEtZm9sbG93LXN0cm9rZT0iIzMzMyIgZGF0YS1mb2xsb3ctZmlsbD0iIzMzMyIgZD0ibTEyIDI5IDEyLTEyIDEyIDEySDEyWiIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=)
 */
export const UpFilled: React.FC<UpFilledProps> = (props) => {
  if (props.color) {
    return <SvgIcon type={svgSource} {...props} />;
  }
  return <FontIcon type='my-icon-up-filled' {...props} />;
};