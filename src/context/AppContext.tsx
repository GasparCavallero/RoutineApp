import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import {
	adjustExerciseWeight,
	createExercise,
	deleteExercise,
	ExerciseRow,
	getAllExercises,
	getExercisesByRoutine,
	reorderExercises,
	updateExercise,
} from '../db/exercises';
import { getHistory, getProgressByExercise, HistoryRow, ProgressPoint } from '../db/history';
import { initDatabase } from '../db/database';
import { createRoutine, deleteRoutine, getRoutines, renameRoutine, reorderRoutines, RoutineRow } from '../db/routines';

export type Routine = RoutineRow;
export type Exercise = ExerciseRow;
export type HistoryEntry = HistoryRow;

type AppContextValue = {
	loading: boolean;
	routines: Routine[];
	exercises: Exercise[];
	history: HistoryEntry[];
	progress: ProgressPoint[];
	loadRoutines: () => Promise<void>;
	addRoutine: (name: string) => Promise<void>;
	updateRoutineName: (id: number, name: string) => Promise<void>;
	removeRoutine: (id: number) => Promise<void>;
	moveRoutines: (orderedIds: number[]) => Promise<void>;
	loadExercises: (routineId: number) => Promise<void>;
	addExercise: (routineId: number, name: string, options?: { sets?: string; weight?: number }) => Promise<void>;
	updateExerciseData: (
		id: number,
		patch: Partial<Pick<ExerciseRow, 'name' | 'weight' | 'sets'>>,
		routineId: number,
	) => Promise<void>;
	changeExerciseWeight: (id: number, delta: number, routineId: number) => Promise<void>;
	removeExercise: (id: number, routineId: number) => Promise<void>;
	moveExercises: (orderedIds: number[], routineId: number) => Promise<void>;
	loadHistory: () => Promise<void>;
	loadProgress: (exerciseId: number) => Promise<void>;
	loadAllExercises: () => Promise<Exercise[]>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
	const [loading, setLoading] = useState(true);
	const [routines, setRoutines] = useState<Routine[]>([]);
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [history, setHistory] = useState<HistoryEntry[]>([]);
	const [progress, setProgress] = useState<ProgressPoint[]>([]);

	const loadRoutines = async () => {
		const data = await getRoutines();
		setRoutines(data);
	};

	const loadExercises = async (routineId: number) => {
		const data = await getExercisesByRoutine(routineId);
		setExercises(data);
	};

	const loadHistory = async () => {
		const data = await getHistory();
		setHistory(data);
	};

	const loadProgress = async (exerciseId: number) => {
		const data = await getProgressByExercise(exerciseId);
		setProgress(data);
	};

	const loadAllExercises = async () => {
		return getAllExercises();
	};

	const addRoutine = async (name: string) => {
		const trimmed = name.trim();
		if (!trimmed) {
			return;
		}

		await createRoutine(trimmed);
		await loadRoutines();
	};

	const updateRoutineName = async (id: number, name: string) => {
		const trimmed = name.trim();
		if (!trimmed) {
			return;
		}

		await renameRoutine(id, trimmed);
		await loadRoutines();
	};

	const removeRoutine = async (id: number) => {
		await deleteRoutine(id);
		await loadRoutines();
		await loadHistory();
	};

	const moveRoutines = async (orderedIds: number[]) => {
		await reorderRoutines(orderedIds);
		await loadRoutines();
	};

	const addExercise = async (routineId: number, name: string, options?: { sets?: string; weight?: number }) => {
		const trimmed = name.trim();
		if (!trimmed) {
			return;
		}

		await createExercise(routineId, trimmed, options);
		await loadExercises(routineId);
		await loadHistory();
	};

	const updateExerciseData = async (
		id: number,
		patch: Partial<Pick<ExerciseRow, 'name' | 'weight' | 'sets'>>,
		routineId: number,
	) => {
		await updateExercise(id, patch);
		await loadExercises(routineId);
		await loadHistory();
	};

	const changeExerciseWeight = async (id: number, delta: number, routineId: number) => {
		await adjustExerciseWeight(id, delta);
		await loadExercises(routineId);
		await loadHistory();
	};

	const removeExercise = async (id: number, routineId: number) => {
		await deleteExercise(id);
		await loadExercises(routineId);
		await loadHistory();
	};

	const moveExercises = async (orderedIds: number[], routineId: number) => {
		await reorderExercises(orderedIds);
		await loadExercises(routineId);
	};

	useEffect(() => {
		const bootstrap = async () => {
			await initDatabase();
			await loadRoutines();
			await loadHistory();
			setLoading(false);
		};

		bootstrap();
	}, []);

	const value = useMemo<AppContextValue>(
		() => ({
			loading,
			routines,
			exercises,
			history,
			progress,
			loadRoutines,
			addRoutine,
			updateRoutineName,
			removeRoutine,
			moveRoutines,
			loadExercises,
			addExercise,
			updateExerciseData,
			changeExerciseWeight,
			removeExercise,
			moveExercises,
			loadHistory,
			loadProgress,
			loadAllExercises,
		}),
		[loading, routines, exercises, history, progress],
	);

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
	const context = useContext(AppContext);

	if (!context) {
		throw new Error('useAppContext must be used inside AppProvider');
	}

	return context;
}
