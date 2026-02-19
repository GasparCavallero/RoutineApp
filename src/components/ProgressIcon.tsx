import { Svg, Path, G } from 'react-native-svg';

interface ProgressIconProps {
	color?: string;
	size?: number;
}

export const ProgressIcon = ({ color = '#000000', size = 24 }: ProgressIconProps) => {
	return (
		<Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
			<G fill={color} fillRule="evenodd">
				<Path d="M18 17a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v15h15a1 1 0 0 1 1 1z" />
				<Path d="M17.83 1.55l-1.04 1.56c.14.275.213.58.21.89a2 2 0 0 1-1.88 1.99l-1.45 2.9A2 2 0 1 1 10 10v-.03L7.97 8.75c-.177.1-.37.172-.57.21l-1.45 4.36A1 1 0 0 1 5 14a1.251 1.251 0 0 1-.32-.05 1.011 1.011 0 0 1-.63-1.27L5.5 8.32A2 2 0 1 1 9 7v.03l2.03 1.22c.26-.147.552-.23.85-.24l1.45-2.9A2.007 2.007 0 0 1 15 2a.569.569 0 0 1 .13.01L16.17.45a1 1 0 0 1 1.66 1.1z" />
			</G>
		</Svg>
	);
};
