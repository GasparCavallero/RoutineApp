import { Svg, Path } from 'react-native-svg';

interface DragIconProps {
	color?: string;
	size?: number;
}

export const DragIcon = ({ color = '#000000', size = 24 }: DragIconProps) => {
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
			<Path 
				d="M5 10H19M14 19L12 21L10 19M14 5L12 3L10 5M5 14H19" 
				stroke={color} 
				strokeWidth="2" 
				strokeLinecap="round" 
				strokeLinejoin="round"
			/>
		</Svg>
	);
};
