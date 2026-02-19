import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useLayoutEffect, useMemo, useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Button } from '../components/Button';
import { EditIcon } from '../components/EditIcon';
import { Input } from '../components/Input';
import { RoutineCard } from '../components/RoutineCard';
import { useAppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

function ThemeSlider({ onPress, mode, theme }: { onPress: () => void; mode: 'light' | 'dark'; theme: any }) {
	const slideAnim = useRef(new Animated.Value(mode === 'dark' ? 22 : 2)).current;

	useEffect(() => {
		Animated.spring(slideAnim, {
			toValue: mode === 'dark' ? 22 : 2,
			useNativeDriver: true,
			speed: 20,
			bounciness: 8,
		}).start();
	}, [mode, slideAnim]);

	return (
		<Pressable
			onPress={onPress}
			style={[
				{
					width: 50,
					height: 28,
					borderRadius: 14,
					marginLeft: 8,
					position: 'relative',
					backgroundColor: mode === 'dark' ? theme.primary : theme.border,
				},
			]}
		>
			<Animated.View
				style={[
					{
						width: 24,
						height: 24,
						borderRadius: 12,
						backgroundColor: '#fff',
						position: 'absolute',
						top: 2,
						left: 0,
						justifyContent: 'center',
						alignItems: 'center',
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.25,
						shadowRadius: 3,
						elevation: 4,
					},
					{ transform: [{ translateX: slideAnim }] },
				]}
			>
				<Text style={{ fontSize: 12 }}>{mode === 'dark' ? '🌙' : '☀️'}</Text>
			</Animated.View>
		</Pressable>
	);
}

export function HomeScreen() {
	const navigation = useNavigation<Navigation>();
	const { theme, toggleTheme, mode } = useThemeContext();
	const { loading, routines, addRoutine, updateRoutineName, removeRoutine, moveRoutines, loadRoutines } = useAppContext();

	const [newRoutineName, setNewRoutineName] = useState('');
	const [editMode, setEditMode] = useState(false);
	const [renameRoutineId, setRenameRoutineId] = useState<number | null>(null);
	const [renameRoutineName, setRenameRoutineName] = useState('');
	const [showAddModal, setShowAddModal] = useState(false);

	useFocusEffect(
		useCallback(() => {
			loadRoutines();
		}, [loadRoutines]),
	);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerLeft: () => <ThemeSlider onPress={toggleTheme} mode={mode} theme={theme} />,
			headerRight: () => (
				<View style={{ flexDirection: 'row', gap: 12, marginRight: 8, alignItems: 'center' }} pointerEvents="box-none">
					<Pressable 
						onPress={() => setEditMode((prev) => !prev)}
						style={({ pressed }) => [
							styles.headerButton,
							{ 
								backgroundColor: pressed ? theme.border : 'transparent',
								borderColor: theme.border,
								height: 32,
								width: 32,
								paddingHorizontal: 0,
							}
						]}
					>
					{editMode ? (
						<Text style={{ color: theme.primary, fontSize: 18 }}>✓</Text>
					) : (
						<EditIcon color={theme.primary} size={20} />
					)}
					</Pressable>
					<Pressable 
						onPress={() => setShowAddModal(true)} 
						style={({ pressed }) => [
							styles.headerButton,
							styles.addButton,
							{ 
								backgroundColor: pressed ? theme.border : 'transparent',
								borderColor: theme.border 
							}
						]}
					>
						<Text style={{ color: theme.primary, fontSize: 28, fontWeight: '600', lineHeight: 28 }}>+</Text>
					</Pressable>
				</View>
			),
		});
	}, [navigation, editMode, theme, mode, toggleTheme]);

	const sortedRoutines = useMemo(() => [...routines].sort((a, b) => a.order - b.order), [routines]);

	if (loading) {
		return (
			<View style={[styles.center, { backgroundColor: theme.background }]}>
				<ActivityIndicator color={theme.primary} />
			</View>
		);
	}

	const renderItem = ({ item, drag, isActive }: RenderItemParams<(typeof sortedRoutines)[number]>) => (
		<View style={{ opacity: isActive ? 0.8 : 1 }}>
			<RoutineCard
				name={item.name}
				editMode={editMode}
				onPress={() => {
					if (!editMode) {
						navigation.navigate('Routine', { routineId: item.id, routineName: item.name });
					}
				}}
				onLongPress={drag}
				onRename={() => {
					setRenameRoutineId(item.id);
					setRenameRoutineName(item.name);
				}}
				onDelete={() => {
					removeRoutine(item.id);
				}}
			/>
		</View>
	);

	return (
		<View style={[styles.container, { backgroundColor: theme.background }]}>
			{showAddModal ? (
				<View style={styles.form}>
					<Input
						value={newRoutineName}
						onChangeText={setNewRoutineName}
						placeholder="Nueva rutina"
						returnKeyType="done"
						onSubmitEditing={async () => {
							await addRoutine(newRoutineName);
							setNewRoutineName('');
							setShowAddModal(false);
						}}
					/>
					<Button
						title="Crear"
						onPress={async () => {
							await addRoutine(newRoutineName);
							setNewRoutineName('');
							setShowAddModal(false);
						}}
					/>
					<Button
						title="Cancelar"
						variant="ghost"
						onPress={() => {
							setNewRoutineName('');
							setShowAddModal(false);
						}}
					/>
				</View>
			) : null}

			{renameRoutineId ? (
				<View style={styles.form}>
					<Input value={renameRoutineName} onChangeText={setRenameRoutineName} placeholder="Nuevo nombre" />
					<Button
						title="Guardar"
						onPress={async () => {
							await updateRoutineName(renameRoutineId, renameRoutineName);
							setRenameRoutineId(null);
							setRenameRoutineName('');
						}}
					/>
					<Button
						title="Cancelar"
						variant="ghost"
						onPress={() => {
							setRenameRoutineId(null);
							setRenameRoutineName('');
						}}
					/>
				</View>
			) : null}

			{!sortedRoutines.length ? (
				<View style={styles.empty}>
					<Text style={[styles.emptyText, { color: theme.textMuted }]}>No hay rutinas todavía.</Text>
				</View>
			) : (
				<DraggableFlatList
					data={sortedRoutines}
					keyExtractor={(item) => String(item.id)}
					renderItem={renderItem}
					onDragEnd={({ data }) => {
						moveRoutines(data.map((item) => item.id));
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
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerButton: {
		paddingHorizontal: 12,
		borderRadius: 8,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
		minWidth: 32,
	},
	addButton: {
		width: 32,
		height: 32,
		paddingHorizontal: 0,
		paddingVertical: 0,
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
});
