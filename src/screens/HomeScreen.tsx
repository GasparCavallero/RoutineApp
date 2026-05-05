import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useLayoutEffect, useMemo, useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View, KeyboardAvoidingView, Modal, Platform } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Button } from '../components/Button';
import { EditIcon } from '../components/EditIcon';
import { Input } from '../components/Input';
import { RoutineCard } from '../components/RoutineCard';
import { useAppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';
import { HomeStackParamList } from '../navigation/AppNavigator';
import { useHeaderHeight } from '@react-navigation/elements';


type Navigation = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export function ThemeSlider({ onPress, mode, theme }: { onPress: () => void; mode: 'light' | 'dark'; theme: any }) {
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

	const scrollY = useRef(new Animated.Value(0)).current;
	const SCROLL_THRESHOLD = 10;

	const headerBg = scrollY.interpolate({
		inputRange: [0, SCROLL_THRESHOLD],
		outputRange: ['transparent', theme.surface],
		extrapolate: 'clamp',
	});

	const headerHeight = useHeaderHeight();

	useFocusEffect(
		useCallback(() => {
			loadRoutines();
		}, [loadRoutines]),
	);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerBackground: () => (
				<Animated.View
					style={{
						flex: 1,
						backgroundColor: headerBg,
					}}
				/>
			),
			headerRight: () => (
				<View style={{ flexDirection: 'row', gap: 16, marginRight: 8, alignItems: 'center' }} pointerEvents="box-none">
					<View>
						<Pressable
							onPress={() => setEditMode((prev) => !prev)}
							style={({ pressed }) => ({
								width: 32,
								height: 32,
								borderRadius: 6,
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
					</View>
					<View>
						<Pressable
							onPress={() => setShowAddModal(true)}
							style={({ pressed }) => ({
								width: 32,
								height: 32,
								borderRadius: 6,
								backgroundColor: pressed ? theme.border : 'transparent',
								alignItems: 'center',
								justifyContent: 'center',
							})}
						>
							<Text style={{ color: theme.primary, fontSize: 28, fontWeight: '600', lineHeight: 28 }}>+</Text>
						</Pressable>
					</View>
				</View>
			),
		});
	}, [navigation, editMode, theme, mode, toggleTheme, headerBg]);

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
			<Modal
				visible={showAddModal}
				animationType="slide"
				transparent
				onRequestClose={() => setShowAddModal(false)}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={styles.modalOverlay}
				>
					<Pressable
						style={styles.modalBackdrop}
						onPress={() => setShowAddModal(false)}
					/>

					<View
						style={[
							styles.modalContent,
							{ backgroundColor: theme.surface }
						]}
					>
						<Text style={[styles.modalTitle, { color: theme.text }]}>
							Nueva Rutina
						</Text>

						<Input
							value={newRoutineName}
							onChangeText={setNewRoutineName}
							placeholder="Nueva rutina"
						/>

						<View style={styles.modalActions}>
							<Button
								title="Cancelar"
								variant="ghost"
								onPress={() => {
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
						</View>
					</View>
				</KeyboardAvoidingView>
			</Modal>

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
					contentContainerStyle={[
						styles.list,
						{
							paddingTop: headerHeight + 14, // Ajusta el padding top para no quedar debajo del header
						}
					]}
					scrollEventThrottle={16}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { y: scrollY } } }],
						{ useNativeDriver: false }
					)}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 14,
		paddingBottom: 0,
		gap: 12,
	},
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	form: {
		flexDirection: 'row',
		gap: 8,
		alignItems: 'center',
	},
	list: {
		gap: 10,
		paddingBottom: 0,
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