import { Pressable, StyleSheet, Text } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';

type ButtonProps = {
	title: string;
	onPress: () => void;
	variant?: 'primary' | 'danger' | 'ghost';
	disabled?: boolean;
};

export function Button({ title, onPress, variant = 'primary', disabled = false }: ButtonProps) {
	const { theme } = useThemeContext();

	const backgroundColor =
		variant === 'primary' ? theme.primary : variant === 'danger' ? theme.danger : 'transparent';

	return (
		<Pressable
			disabled={disabled}
			onPress={onPress}
			style={({ pressed }) => [
				styles.button,
				{
					backgroundColor,
					borderColor: theme.border,
					opacity: pressed || disabled ? 0.7 : 1,
				},
			]}
		>
			<Text style={[styles.label, { color: variant === 'ghost' ? theme.text : theme.surface }]}>{title}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 10,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
	},
});
