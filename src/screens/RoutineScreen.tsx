import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Button } from '../components/Button';
import { EditIcon } from '../components/EditIcon';
import { ExerciseCard } from '../components/ExerciseCard';
import { Input } from '../components/Input';
import { useAppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RoutineRoute = RouteProp<RootStackParamList, 'Routine'>;
type Navigation = NativeStackNavigationProp<RootStackParamList, 'Routine'>;

export function RoutineScreen() {
	const route = useRoute<RoutineRoute>();
	const navigation = useNavigation<Navigation>();
	const { routineId, routineName } = route.params;

	const { theme } = useThemeContext();
	const { exercises, addExercise, loadExercises, changeExerciseWeight, moveExercises, removeExercise, updateExerciseData } =
		useAppContext();

	const [editMode, setEditMode] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [newExerciseName, setNewExerciseName] = useState('');
	const [newExerciseSets, setNewExerciseSets] = useState('3');
	const [newExerciseReps, setNewExerciseReps] = useState('10');
	const [newExerciseWeight, setNewExerciseWeight] = useState('0');
	const [renameExerciseId, setRenameExerciseId] = useState<number | null>(null);
	const [renameExerciseName, setRenameExerciseName] = useState('');
	const [editWeightExerciseId, setEditWeightExerciseId] = useState<number | null>(null);
	const [editWeightValue, setEditWeightValue] = useState('');

	useFocusEffect(
		useCallback(() => {
			loadExercises(routineId);
		}, [loadExercises, routineId]),
	);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: routineName,
			headerLeft: () => (
				<Pressable 
					onPress={() => navigation.goBack()}
					style={({ pressed }) => ({
						alignItems: 'center',
						justifyContent: 'center',
						marginLeft: 12,
						opacity: pressed ? 0.5 : 1,
					})}
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
				>
					<Text style={{ color: theme.primary, fontSize: 28, fontWeight: '400' }}>‹</Text>
				</Pressable>
			),
			headerRight: () => (
				<View style={{ flexDirection: 'row', gap: 12, marginRight: 8, alignItems: 'center' }} pointerEvents="box-none">
					<Pressable 
						onPress={() => setEditMode((prev) => !prev)}
						style={({ pressed }) => ({
							width: 32,
							height: 32,
							borderRadius: 8,
							borderWidth: 1,
							borderColor: theme.border,
							backgroundColor: pressed ? theme.border : 'transparent',
							alignItems: 'center',
							justifyContent: 'center',
						})}
					>
						{editMode ? (
							<Text style={{ color: theme.primary, fontSize: 18 }}>✓</Text>
						) : (
							<EditIcon color={theme.primary} size={20} />
						)}
					</Pressable>
					<Pressable 
						onPress={() => setShowAddModal(true)} 
						style={({ pressed }) => ({
							width: 32,
							height: 32,
							borderRadius: 8,
							borderWidth: 1,
							borderColor: theme.border,
							backgroundColor: pressed ? theme.border : 'transparent',
							alignItems: 'center',
							justifyContent: 'center',
						})}
					>
						<Text style={{ color: theme.primary, fontSize: 28, fontWeight: '600', lineHeight: 28 }}>+</Text>
					</Pressable>
				</View>
			),
		});
	}, [navigation, editMode, theme]);

	const handleAddExercise = async () => {
		const name = newExerciseName.trim();
		if (!name) {
			Alert.alert('Error', 'El nombre del ejercicio es obligatorio');
			return;
		}

		const sets = parseInt(newExerciseSets, 10);
		const reps = newExerciseReps.trim();
		const weight = parseFloat(newExerciseWeight.replace(',', '.'));

		if (isNaN(sets) || sets < 1) {
			Alert.alert('Error', 'El número de series debe ser un número válido mayor que 0');
			return;
		}

		if (!reps) {
			Alert.alert('Error', 'Las repeticiones son obligatorias');
			return;
		}

		if (isNaN(weight) || weight < 0) {
			Alert.alert('Error', 'El peso debe ser un número válido');
			return;
		}

		await addExercise(routineId, name, { sets: `${sets}x${reps}`, weight });
		setNewExerciseName('');
		setNewExerciseSets('3');
		setNewExerciseReps('10');
		setNewExerciseWeight('0');
		setShowAddModal(false);
	};

	const handleEditWeight = async () => {
		if (!editWeightExerciseId) return;

		const weight = parseFloat(editWeightValue.replace(',', '.'));

		if (isNaN(weight) || weight < 0) {
			Alert.alert('Error', 'El peso debe ser un número válido');
			return;
		}

		await updateExerciseData(editWeightExerciseId, { weight }, routineId);
		setEditWeightExerciseId(null);
		setEditWeightValue('');
	};

	const sortedExercises = useMemo(() => [...exercises].sort((a, b) => a.order - b.order), [exercises]);

	const renderItem = ({ item, drag, isActive }: RenderItemParams<(typeof sortedExercises)[number]>) => (
		<View style={{ opacity: isActive ? 0.8 : 1 }}>
			<ExerciseCard
				name={item.name}
				weight={item.weight}
				record={item.record}
				sets={item.sets}
				editMode={editMode}
				onDecrease={() => changeExerciseWeight(item.id, -2.5, routineId)}
				onIncrease={() => changeExerciseWeight(item.id, 2.5, routineId)}
				onLongPress={drag}
				onRename={() => {
					setRenameExerciseId(item.id);
					setRenameExerciseName(item.name);
				}}
				onEditWeight={
					editMode
						? () => {
								setEditWeightExerciseId(item.id);
								setEditWeightValue(String(item.weight));
						  }
						: undefined
				}
				onDelete={() => removeExercise(item.id, routineId)}
			/>
		</View>
	);

	return (
		<View style={[styles.container, { backgroundColor: theme.background }]}>
			<Modal visible={showAddModal} animationType="slide" transparent onRequestClose={() => setShowAddModal(false)}>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={styles.modalOverlay}
				>
					<Pressable style={styles.modalBackdrop} onPress={() => setShowAddModal(false)} />
					<View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
						<Text style={[styles.modalTitle, { color: theme.text }]}>Nuevo Ejercicio</Text>

						<Input
							value={newExerciseName}
							onChangeText={setNewExerciseName}
							placeholder="Nombre del ejercicio"
							style={styles.modalInput}
						/>

						<View style={styles.modalRow}>
							<View style={{ flex: 1 }}>
								<Text style={[styles.modalLabel, { color: theme.textMuted }]}>Series</Text>
								<Input
									value={newExerciseSets}
									onChangeText={setNewExerciseSets}
									placeholder="3"
									keyboardType="number-pad"
									style={styles.modalInput}
								/>
							</View>
							<View style={{ flex: 1 }}>
								<Text style={[styles.modalLabel, { color: theme.textMuted }]}>Repeticiones</Text>
								<Input
									value={newExerciseReps}
									onChangeText={setNewExerciseReps}
									placeholder="10"
									style={styles.modalInput}
								/>
							</View>
						</View>

						<View>
							<Text style={[styles.modalLabel, { color: theme.textMuted }]}>Peso inicial (kg)</Text>
							<Input
								value={newExerciseWeight}
								onChangeText={setNewExerciseWeight}
								placeholder="0"
								keyboardType="decimal-pad"
								style={styles.modalInput}
							/>
						</View>

						<View style={styles.modalActions}>
							<Button title="Cancelar" variant="ghost" onPress={() => setShowAddModal(false)} />
							<Button title="Crear" onPress={handleAddExercise} />
						</View>
					</View>
				</KeyboardAvoidingView>
			</Modal>

			<Modal visible={!!editWeightExerciseId} animationType="slide" transparent onRequestClose={() => setEditWeightExerciseId(null)}>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={styles.modalOverlay}
				>
					<Pressable style={styles.modalBackdrop} onPress={() => setEditWeightExerciseId(null)} />
					<View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
						<Text style={[styles.modalTitle, { color: theme.text }]}>Editar Peso</Text>

						<View>
							<Text style={[styles.modalLabel, { color: theme.textMuted }]}>Peso (kg)</Text>
							<Input
								value={editWeightValue}
								onChangeText={setEditWeightValue}
								placeholder="0"
								keyboardType="decimal-pad"
								style={styles.modalInput}
							/>
						</View>

						<View style={styles.modalActions}>
							<Button title="Cancelar" variant="ghost" onPress={() => setEditWeightExerciseId(null)} />
							<Button title="Guardar" onPress={handleEditWeight} />
						</View>
					</View>
				</KeyboardAvoidingView>
			</Modal>

			{renameExerciseId ? (
				<View style={styles.form}>
					<Input value={renameExerciseName} onChangeText={setRenameExerciseName} placeholder="Nuevo nombre" />
					<Button
						title="Guardar"
						onPress={async () => {
							await updateExerciseData(renameExerciseId, { name: renameExerciseName }, routineId);
							setRenameExerciseId(null);
							setRenameExerciseName('');
						}}
					/>
					<Button
						title="Cancelar"
						variant="ghost"
						onPress={() => {
							setRenameExerciseId(null);
							setRenameExerciseName('');
						}}
					/>
				</View>
			) : null}

			{!sortedExercises.length ? (
				<View style={styles.empty}>
					<Text style={[styles.emptyText, { color: theme.textMuted }]}>Aún no hay ejercicios.</Text>
				</View>
			) : (
				<DraggableFlatList
					data={sortedExercises}
					keyExtractor={(item) => String(item.id)}
					renderItem={renderItem}
					onDragEnd={({ data }) => {
						moveExercises(data.map((item) => item.id), routineId);
					}}
					contentContainerStyle={styles.list}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 14,
		gap: 12,
	},
	form: {
		flexDirection: 'row',
		gap: 8,
		alignItems: 'center',
	},
	list: {
		gap: 10,
		paddingBottom: 20,
	},
	empty: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyText: {
		fontSize: 14,
	},
	modalOverlay: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	modalBackdrop: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 20,
		gap: 16,
		maxHeight: '80%',
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: '700',
		marginBottom: 4,
	},
	modalLabel: {
		fontSize: 12,
		fontWeight: '600',
		marginBottom: 4,
	},
	modalInput: {
		marginBottom: 0,
	},
	modalRow: {
		flexDirection: 'row',
		gap: 12,
	},
	modalActions: {
		flexDirection: 'row',
		gap: 10,
		marginTop: 8,
	},
});
