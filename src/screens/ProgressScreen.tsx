import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Button } from '../components/Button';
import { useAppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';
import { formatDate, toKg } from '../utils/helpers';

const chartWidth = Math.max(Dimensions.get('window').width - 28, 260);

export function ProgressScreen() {
	const { theme } = useThemeContext();
	const { loadAllExercises, loadProgress, progress } = useAppContext();

	const [exerciseList, setExerciseList] = useState<Array<{ id: number; name: string }>>([]);
	const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);

	useFocusEffect(
		useCallback(() => {
			const refresh = async () => {
				const list = await loadAllExercises();
				const seenNames = new Set<string>();
				const uniqueExercises = list.filter((item) => {
					const normalizedName = item.name.trim().toLowerCase();
					if (seenNames.has(normalizedName)) {
						return false;
					}

					seenNames.add(normalizedName);
					return true;
				});

				setExerciseList(uniqueExercises.map((item) => ({ id: item.id, name: item.name })));

				if (!selectedExerciseId && uniqueExercises.length) {
					const firstId = uniqueExercises[0].id;
					setSelectedExerciseId(firstId);
					await loadProgress(firstId);
				}
			};

			refresh();
		}, [loadAllExercises, loadProgress, selectedExerciseId]),
	);

	const chartData = useMemo(
		() => ({
			labels: progress.map((p) => formatDate(p.date)).slice(-6),
			datasets: [{ data: progress.map((p) => p.weight).slice(-6) }],
		}),
		[progress],
	);

	return (
		<ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
			<Text style={[styles.title, { color: theme.text }]}>Seleccioná un ejercicio</Text>

			<View style={styles.selector}>
				{exerciseList.map((exercise) => (
					<Button
						key={exercise.id}
						title={exercise.name}
						variant={selectedExerciseId === exercise.id ? 'primary' : 'ghost'}
						onPress={async () => {
							setSelectedExerciseId(exercise.id);
							await loadProgress(exercise.id);
						}}
					/>
				))}
			</View>

			{!selectedExerciseId ? (
				<Text style={[styles.empty, { color: theme.textMuted }]}>No hay ejercicios cargados.</Text>
			) : progress.length < 2 ? (
				<Text style={[styles.empty, { color: theme.textMuted }]}>Faltan registros para mostrar progreso.</Text>
			) : (
				<View style={[styles.chartBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
					<LineChart
						data={chartData}
						width={chartWidth}
						height={240}
						withVerticalLines={false}
						withInnerLines={false}
						chartConfig={{
							backgroundColor: theme.surface,
							backgroundGradientFrom: theme.surface,
							backgroundGradientTo: theme.surface,
							decimalPlaces: 1,
							color: () => theme.primary,
							labelColor: () => theme.textMuted,
							propsForDots: {
								r: '4',
								strokeWidth: '1',
								stroke: theme.primary,
							},
						}}
						style={styles.chart}
					/>
				</View>
			)}

			{progress.length ? (
				<View style={styles.historyList}>
					<Text style={[styles.subtitle, { color: theme.text }]}>Datos históricos</Text>
					{progress
						.slice()
						.reverse()
						.map((item, index) => (
							<Text key={`${item.date}-${index}`} style={{ color: theme.textMuted }}>
								{formatDate(item.date)} · {toKg(item.weight)}
							</Text>
						))}
				</View>
			) : null}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		padding: 14,
		gap: 12,
	},
	title: {
		fontSize: 18,
		fontWeight: '700',
	},
	subtitle: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: 8,
	},
	selector: {
		flexDirection: 'row',
		gap: 8,
		flexWrap: 'wrap',
	},
	chartBox: {
		borderWidth: 1,
		borderRadius: 12,
		paddingVertical: 8,
		overflow: 'hidden',
	},
	chart: {
		borderRadius: 10,
		marginLeft: -16,
	},
	historyList: {
		gap: 6,
	},
	empty: {
		marginTop: 12,
	},
});
