import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { Button } from './Button';
import { DragIcon } from './DragIcon';
import { TrashIcon } from './TrashIcon';

type RoutineCardProps = {
	name: string;
	editMode: boolean;
	onPress: () => void;
	onLongPress?: () => void;
	onRename: () => void;
	onDelete: () => void;
};

export function RoutineCard({ name, editMode, onPress, onLongPress, onRename, onDelete }: RoutineCardProps) {
	const { theme } = useThemeContext();

	return (
		<Pressable
			onPress={onPress}
			onLongPress={onLongPress}
			style={({ pressed }) => [
				styles.card,
				{
					backgroundColor: theme.surface,
					borderColor: theme.border,
					opacity: pressed ? 0.85 : 1,
				},
			]}
		>
			<View style={styles.row}>
				<Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
					{name}
				</Text>
				{editMode ? <DragIcon color={theme.textMuted} size={20} /> : null}
			</View>

			{editMode ? (
				<View style={styles.actions}>
					<Button title="Renombrar" onPress={onRename} variant="ghost" />
					<Button title="" onPress={onDelete} variant="danger" icon={<TrashIcon color="#fff" size={16} />} />
				</View>
			) : null}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: {
		borderWidth: 1,
		borderRadius: 12,
		padding: 12,
		gap: 10,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	name: {
		fontSize: 16,
		fontWeight: '700',
		flex: 1,
	},
	drag: {
		marginLeft: 12,
		fontSize: 18,
	},
	actions: {
		flexDirection: 'row',
		gap: 8,
	},
});
