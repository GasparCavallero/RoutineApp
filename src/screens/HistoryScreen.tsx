import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState, useLayoutEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, ScrollView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { Input } from '../components/Input';
import { useAppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';
import { formatDateTime, toKg } from '../utils/helpers';

export function HistoryScreen() {
	const { theme } = useThemeContext();
	const { history, loadHistory } = useAppContext();

	const [routineFilter, setRoutineFilter] = useState('');
	const [exerciseFilter, setExerciseFilter] = useState('');

	const navigation = useNavigation();
	const headerHeight = useHeaderHeight();
	const scrollY = useRef(new Animated.Value(0)).current;

	const SCROLL_THRESHOLD = 80;

	const headerOpacity = scrollY.interpolate({
		inputRange: [0, SCROLL_THRESHOLD],
		outputRange: [0, 1],
		extrapolate: 'clamp',
	});

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTransparent: true,
			headerShadowVisible: false,
			headerBackground: () => (
				<Animated.View
					style={{
						flex: 1,
						backgroundColor: headerOpacity,
					}}
				/>
			),
		});
	}, [navigation, headerOpacity]);

	useFocusEffect(
		useCallback(() => {
			loadHistory();
		}, [loadHistory]),
	);

	const filteredHistory = useMemo(() => {
		const routine = routineFilter.trim().toLowerCase();
		const exercise = exerciseFilter.trim().toLowerCase();

		return history.filter((item) => {
			const routineMatch = routine
				? item.routine_name.toLowerCase().includes(routine)
				: true;

			const exerciseMatch = exercise
				? item.exercise_name.toLowerCase().includes(exercise)
				: true;

			return routineMatch && exerciseMatch;
		});
	}, [history, routineFilter, exerciseFilter]);

	return (
		<View 
			style={[
				styles.container, 
				{ 
					backgroundColor: theme.background 
				}
			]}
		>
			<Animated.ScrollView
				scrollEventThrottle={16}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: false }
				)}
				contentContainerStyle={[
					styles.list,
					{
						paddingTop: headerHeight + 14,
					},
				]}
			>
				<View 
					style={[
						styles.filters,
					]}
				>
					<Input
						value={routineFilter}
						onChangeText={setRoutineFilter}
						placeholder="Filtrar por rutina"
					/>

					<Input
						value={exerciseFilter}
						onChangeText={setExerciseFilter}
						placeholder="Filtrar por ejercicio"
					/>
				</View>

				{filteredHistory.length === 0 ? (
					<Text style={[styles.empty, { color: theme.textMuted }]}>
						Sin registros aún.
					</Text>
				) : (
					filteredHistory.map((item) => (
						<View
							key={item.id}
							style={[
								styles.card,
								{
									backgroundColor: theme.surface,
									borderColor: theme.border,
								},
							]}
						>
							<Text style={[styles.title, { color: theme.text }]}>
								{item.exercise_name}
							</Text>

							<Text style={[styles.subtitle, { color: theme.textMuted }]}>
								{item.routine_name}
							</Text>

							<Text style={[styles.value, { color: theme.text }]}>
								{toKg(item.weight)} · {item.sets}
							</Text>

							<Text style={[styles.date, { color: theme.textMuted }]}>
								{formatDateTime(item.date)}
							</Text>
						</View>
					))
				)}
			</Animated.ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	filters: {
		gap: 8,
		marginBottom: 12,
		backgroundColor: "transparent"
	},
	list: {
		paddingHorizontal: 14,
		paddingBottom: 20,
		gap: 10,
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