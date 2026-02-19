import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { toKg } from '../utils/helpers';
import { Button } from './Button';
import { DragIcon } from './DragIcon';

type ExerciseCardProps = {
	name: string;
	weight: number;
	record: number;
	sets: string;
	editMode: boolean;
	onIncrease: () => void;
	onDecrease: () => void;
	onLongPress?: () => void;
	onRename: () => void;
	onDelete: () => void;
	onEditWeight?: () => void;
};

export function ExerciseCard({
	name,
	weight,
	record,
	sets,
	editMode,
	onIncrease,
	onDecrease,
	onLongPress,
	onRename,
	onDelete,
	onEditWeight,
}: ExerciseCardProps) {
	const { theme } = useThemeContext();

	return (
		<Pressable
			onLongPress={onLongPress}
			style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
		>
			<View style={styles.header}>
				<Text style={[styles.name, { color: theme.text }]}>{name}</Text>
				{editMode ? <DragIcon color={theme.textMuted} size={20} /> : null}
			</View>
			<View style={styles.metrics}>
				<Text style={[styles.value, { color: theme.text }]}>Peso: {toKg(weight)}</Text>
				<Text style={[styles.value, { color: theme.text }]}>Récord: {toKg(record)}</Text>
				<Text style={[styles.value, { color: theme.textMuted }]}>Series: {sets}</Text>
			</View>

			<View style={styles.actions}>
				<Button title="-2.5" onPress={onDecrease} />
				<Button title="+2.5" onPress={onIncrease} />
			</View>

			{editMode ? (
				<View style={styles.actions}>
					<Button title="Renombrar" onPress={onRename} variant="ghost" />
					{onEditWeight && <Button title="Editar peso" onPress={onEditWeight} variant="ghost" />}
					<Button title="Borrar" onPress={onDelete} variant="danger" />
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
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	name: {
		fontSize: 15,
		fontWeight: '700',
		flex: 1,
	},
	drag: {
		marginLeft: 12,
		fontSize: 18,
	},
	metrics: {
		gap: 4,
	},
	value: {
		fontSize: 14,
	},
	actions: {
		flexDirection: 'row',
		gap: 8,
	},
});
