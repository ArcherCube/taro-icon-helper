import { Icon as SvgIcon } from './base/svg-icon';
import { Icon as FontIcon } from './base/font-icon';
import svgSource from '../../../assets/svg/down-outlined.svg';
export type DownOutlinedProps = Partial<Omit<React.ComponentProps<typeof SvgIcon> & React.ComponentProps<typeof FontIcon>, 'type'>>;
/**
 * ![down-outlined.svg](data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDggNDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBzdHJva2U9Im5vbmUiPjxwYXRoIGRhdGEtZm9sbG93LXN0cm9rZT0iIzMzMyIgZD0iTTM2IDE4IDI0IDMwIDEyIDE4IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==)
 */
export const DownOutlined: React.FC<DownOutlinedProps> = (props) => {
  if (props.color) {
    return <SvgIcon type={svgSource} {...props} />;
  }
  return <FontIcon type='my-icon-down-outlined' {...props} />;
};