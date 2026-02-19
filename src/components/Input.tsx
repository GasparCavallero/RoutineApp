import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';

type InputProps = TextInputProps;

export function Input(props: InputProps) {
	const { theme } = useThemeContext();

	return (
		<TextInput
			placeholderTextColor={theme.textMuted}
			{...props}
			style={[
				styles.input,
				{
					color: theme.text,
					borderColor: theme.border,
					backgroundColor: theme.surface,
				},
				props.style,
			]}
		/>
	);
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 14,
	},
});
