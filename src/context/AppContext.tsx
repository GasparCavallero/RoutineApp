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
import { getDb, initDatabase } from '../db/database';
import { createRoutine, deleteRoutine, getRoutines, renameRoutine, reorderRoutines, RoutineRow } from '../db/routines';

export type Routine = RoutineRow;
export type Exercise = ExerciseRow;
export type HistoryEntry = HistoryRow;

type ImportDataPayload = {
	routines?: Array<Partial<Routine>>;
	exercises?: Array<Partial<Exercise>>;
	history?: Array<Partial<Pick<HistoryEntry, 'exercise_id' | 'date' | 'weight' | 'sets'>>>;
};

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
	importData: (payload: ImportDataPayload) => Promise<void>;
	getExportData: () => Promise<{
		routines: Routine[];
		exercises: Exercise[];
		history: HistoryEntry[];
	}>;
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

	const importData = async (payload: ImportDataPayload) => {
		const db = await getDb();
		const routinesToImport = Array.isArray(payload.routines) ? payload.routines : [];
		const exercisesToImport = Array.isArray(payload.exercises) ? payload.exercises : [];
		const historyToImport = Array.isArray(payload.history) ? payload.history : [];

		await db.withTransactionAsync(async () => {
			await db.runAsync('DELETE FROM history;');
			await db.runAsync('DELETE FROM exercises;');
			await db.runAsync('DELETE FROM routines;');

			const routineIdMap = new Map<number, number>();
			const sortedRoutines = [...routinesToImport].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

			for (const [index, routine] of sortedRoutines.entries()) {
				const name =
					typeof routine.name === 'string' && routine.name.trim().length > 0
						? routine.name.trim()
						: `Rutina ${index + 1}`;
				const order = Number.isFinite(routine.order) ? Number(routine.order) : index;
				const createdAt =
					typeof routine.created_at === 'string' && routine.created_at
						? routine.created_at
						: new Date().toISOString();

				const inserted = await db.runAsync(
					'INSERT INTO routines (name, "order", created_at) VALUES (?, ?, ?);',
					name,
					order,
					createdAt,
				);

				if (typeof routine.id === 'number') {
					routineIdMap.set(routine.id, Number(inserted.lastInsertRowId));
				}
			}

			const exerciseIdMap = new Map<number, number>();
			const sortedExercises = [...exercisesToImport].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

			for (const [index, exercise] of sortedExercises.entries()) {
				if (typeof exercise.routine_id !== 'number') {
					continue;
				}

				const mappedRoutineId = routineIdMap.get(exercise.routine_id);
				if (!mappedRoutineId) {
					continue;
				}

				const name =
					typeof exercise.name === 'string' && exercise.name.trim().length > 0
						? exercise.name.trim()
						: `Ejercicio ${index + 1}`;
				const weight = Number.isFinite(exercise.weight) ? Number(exercise.weight) : 0;
				const record = Number.isFinite(exercise.record) ? Number(exercise.record) : weight;
				const sets =
					typeof exercise.sets === 'string' && exercise.sets.trim().length > 0 ? exercise.sets.trim() : '3x10';
				const order = Number.isFinite(exercise.order) ? Number(exercise.order) : index;

				const inserted = await db.runAsync(
					'INSERT INTO exercises (routine_id, name, weight, record, sets, "order") VALUES (?, ?, ?, ?, ?, ?);',
					mappedRoutineId,
					name,
					weight,
					record,
					sets,
					order,
				);

				if (typeof exercise.id === 'number') {
					exerciseIdMap.set(exercise.id, Number(inserted.lastInsertRowId));
				}
			}

			for (const entry of historyToImport) {
				if (typeof entry.exercise_id !== 'number') {
					continue;
				}

				const mappedExerciseId = exerciseIdMap.get(entry.exercise_id);
				if (!mappedExerciseId) {
					continue;
				}

				const date = typeof entry.date === 'string' && entry.date ? entry.date : new Date().toISOString();
				const weight = Number.isFinite(entry.weight) ? Number(entry.weight) : 0;
				const sets = typeof entry.sets === 'string' && entry.sets.trim().length > 0 ? entry.sets.trim() : '3x10';

				await db.runAsync(
					'INSERT INTO history (exercise_id, date, weight, sets) VALUES (?, ?, ?, ?);',
					mappedExerciseId,
					date,
					weight,
					sets,
				);
			}
		});

		const updatedRoutines = await getRoutines();
		setRoutines(updatedRoutines);

		if (updatedRoutines[0]) {
			await loadExercises(updatedRoutines[0].id);
		} else {
			setExercises([]);
		}

		await loadHistory();
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
		const withTimeout = async <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
			let timeoutId: ReturnType<typeof setTimeout> | undefined;
			const timeoutPromise = new Promise<never>((_, reject) => {
				timeoutId = setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms);
			});

			try {
				return await Promise.race([promise, timeoutPromise]);
			} finally {
				if (timeoutId) {
					clearTimeout(timeoutId);
				}
			}
		};

		const bootstrap = async () => {
			try {
				await withTimeout(initDatabase(), 10000, 'initDatabase');
				await withTimeout(loadRoutines(), 10000, 'loadRoutines');
				await withTimeout(loadHistory(), 10000, 'loadHistory');
			} catch (error) {
				console.error('App bootstrap failed:', error);
				setRoutines([]);
				setExercises([]);
				setHistory([]);
				setProgress([]);
			} finally {
				setLoading(false);
			}
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
			importData,
			getExportData: async () => {
				const allRoutines = await getRoutines();
				const allExercises = await getAllExercises();
				const allHistory = await getHistory();

				return {
					routines: allRoutines,
					exercises: allExercises,
					history: allHistory,
				};
			},
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
