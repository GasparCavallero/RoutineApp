import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Input } from '../components/Input';
import { useAppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';
import { formatDateTime, toKg } from '../utils/helpers';

export function HistoryScreen() {
	const { theme } = useThemeContext();
	const { history, loadHistory } = useAppContext();

	const [routineFilter, setRoutineFilter] = useState('');
	const [exerciseFilter, setExerciseFilter] = useState('');

	useFocusEffect(
		useCallback(() => {
			loadHistory();
		}, [loadHistory]),
	);

	const filteredHistory = useMemo(() => {
		const routine = routineFilter.trim().toLowerCase();
		const exercise = exerciseFilter.trim().toLowerCase();

		return history.filter((item) => {
			const routineMatch = routine ? item.routine_name.toLowerCase().includes(routine) : true;
			const exerciseMatch = exercise ? item.exercise_name.toLowerCase().includes(exercise) : true;
			return routineMatch && exerciseMatch;
		});
	}, [history, routineFilter, exerciseFilter]);

	return (
		<View style={[styles.container, { backgroundColor: theme.background }]}>
			<View style={styles.filters}>
				<Input value={routineFilter} onChangeText={setRoutineFilter} placeholder="Filtrar por rutina" />
				<Input value={exerciseFilter} onChangeText={setExerciseFilter} placeholder="Filtrar por ejercicio" />
			</View>

			<FlatList
				data={filteredHistory}
				keyExtractor={(item) => String(item.id)}
				contentContainerStyle={styles.list}
				ListEmptyComponent={<Text style={[styles.empty, { color: theme.textMuted }]}>Sin registros aún.</Text>}
				renderItem={({ item }) => (
					<View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
						<Text style={[styles.title, { color: theme.text }]}>{item.exercise_name}</Text>
						<Text style={[styles.subtitle, { color: theme.textMuted }]}>{item.routine_name}</Text>
						<Text style={[styles.value, { color: theme.text }]}>
							{toKg(item.weight)} · {item.sets}
						</Text>
						<Text style={[styles.date, { color: theme.textMuted }]}>{formatDateTime(item.date)}</Text>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 14,
		gap: 12,
	},
	filters: {
		gap: 8,
	},
	list: {
		gap: 10,
		paddingBottom: 20,
	},
	card: {
		borderWidth: 1,
		borderRadius: 12,
		padding: 12,
		gap: 4,
	},
	title: {
		fontSize: 15,
		fontWeight: '700',
	},
	subtitle: {
		fontSize: 13,
	},
	value: {
		fontSize: 14,
		fontWeight: '600',
	},
	date: {
		fontSize: 12,
	},
	empty: {
		textAlign: 'center',
		marginTop: 20,
	},
});
