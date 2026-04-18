import { Svg, Path } from 'react-native-svg';

interface TrashIconProps {
  color?: string;
  size?: number;
}

export const TrashIcon = ({ color = '#fff', size = 24 }: TrashIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10 2l-1 1H5c-.6 0-1 .4-1 1s.4 1 1 1h2h10h2c.6 0 1-.4 1-1s-.4-1-1-1h-4l-1-1zM5 7v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7zM9 9c.6 0 1 .4 1 1v9c0 .6-.4 1-1 1s-1-.4-1-1v-9c0-.6.4-1 1-1zm6 0c.6 0 1 .4 1 1v9c0 .6-.4 1-1 1s-1-.4-1-1v-9c0-.6.4-1 1-1z"
      fill={color}
    />
  </Svg>
);
