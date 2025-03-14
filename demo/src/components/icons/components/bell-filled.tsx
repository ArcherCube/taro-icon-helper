import { Icon as SvgIcon } from './base/svg-icon';
import { Icon as FontIcon } from './base/font-icon';
import svgSource from '../../../assets/svg/bell-filled.svg';
export type BellFilledProps = Partial<Omit<React.ComponentProps<typeof SvgIcon> & React.ComponentProps<typeof FontIcon>, 'type'>>;
/**
 * ![bell-filled.svg](data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzQxOTE1NTMwMTQyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjcwMjAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHN0cm9rZT0ibm9uZSIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTY0MCA4MzJhMTI4IDEyOCAwIDAgMS0yNTYgMHogbTE5Mi02NEgxMzQuNGEzOC40IDM4LjQgMCAwIDEgMC03Ni44SDE5MlY0NDhjMC0xNTQuODggMTEwLjA4LTI4NC4xNiAyNTYuMzItMzEzLjZhNjQgNjQgMCAxIDEgMTI3LjM2IDBBMzIwLjEzIDMyMC4xMyAwIDAgMSA4MzIgNDQ4djI0My4yaDU3LjZhMzguNCAzOC40IDAgMCAxIDAgNzYuOHoiIHAtaWQ9IjcwMjEiIGZpbGw9IiNmZmYiPjwvcGF0aD48L3N2Zz4=)
 */
export const BellFilled: React.FC<BellFilledProps> = (props) => {
  if (props.color) {
    return <SvgIcon type={svgSource} {...props} />;
  }
  return <FontIcon type='my-icon-bell-filled' {...props} />;
};