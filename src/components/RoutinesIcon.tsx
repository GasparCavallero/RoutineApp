import { Svg, Path } from 'react-native-svg';

interface RoutinesIconProps {
	color?: string;
	size?: number;
}

export const RoutinesIcon = ({ color = '#000000', size = 24 }: RoutinesIconProps) => {
	return (
		<Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
			<Path d="M13.9138,22.6411l10.6346,9.8405L40.891,15.7128" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<Path d="M41.8921,31.2658c-2.1603,9.3573-11.1657,15.4697-20.6595,14.0226-9.4938-1.4471-16.2692-9.9649-15.5436-19.5409,.7256-9.576,8.7072-16.9756,18.3106-16.9756" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<Path d="M24.1806,2.5001l6.7473,6.3151-6.9282,6.7443" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<Path d="M23.9996,8.7719l6.9282,.0434" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</Svg>
	);
};
