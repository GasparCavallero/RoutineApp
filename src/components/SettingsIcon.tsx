import { Svg, Path, Rect } from 'react-native-svg';

interface SettingsIconProps {
	color?: string;
	size?: number;
}

export const SettingsIcon = ({ color = '#000000', size = 24 }: SettingsIconProps) => {
	return (
		<Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
			<Rect width="48" height="48" fill="white" fillOpacity="0.01" />
			<Path d="M41.5 10H35.5" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
			<Path d="M27.5 6V14" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
			<Path d="M27.5 10L5.5 10" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
			<Path d="M13.5 24H5.5" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
			<Path d="M21.5 20V28" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
			<Path d="M43.5 24H21.5" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
			<Path d="M41.5 38H35.5" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
			<Path d="M27.5 34V42" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
			<Path d="M27.5 38H5.5" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
		</Svg>
	);
};
