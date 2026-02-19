import { roundToStep } from '../utils/helpers';
import { getDb } from './database';

export type ExerciseRow = {
	id: number;
	routine_id: number;
	name: string;
	weight: number;
	record: number;
	sets: string;
	order: number;
};

type ExerciseSnapshot = {
	id: number;
	weight: number;
	record: number;
	sets: string;
};

export async function getExercisesByRoutine(routineId: number) {
	const db = await getDb();
	return db.getAllAsync<ExerciseRow>(
		'SELECT id, routine_id, name, weight, record, sets, "order" FROM exercises WHERE routine_id = ? ORDER BY "order" ASC, id ASC;',
		routineId,
	);
}

export async function getAllExercises() {
	const db = await getDb();
	return db.getAllAsync<ExerciseRow>(
		'SELECT id, routine_id, name, weight, record, sets, "order" FROM exercises ORDER BY name ASC;',
	);
}

export async function createExercise(
	routineId: number,
	name: string,
	options?: { sets?: string; weight?: number },
) {
	const db = await getDb();
	const result = await db.getFirstAsync<{ maxOrder: number | null }>(
		'SELECT MAX("order") as maxOrder FROM exercises WHERE routine_id = ?;',
		routineId,
	);
	const nextOrder = (result?.maxOrder ?? -1) + 1;

	const initialWeight = options?.weight ?? 0;
	const initialSets = options?.sets ?? '3x10';

	const insert = await db.runAsync(
		'INSERT INTO exercises (routine_id, name, weight, record, sets, "order") VALUES (?, ?, ?, ?, ?, ?);',
		routineId,
		name,
		initialWeight,
		initialWeight,
		initialSets,
		nextOrder,
	);

	if (initialWeight > 0) {
		await db.runAsync(
			'INSERT INTO history (exercise_id, date, weight, sets) VALUES (?, ?, ?, ?);',
			insert.lastInsertRowId,
			new Date().toISOString(),
			initialWeight,
			initialSets,
		);
	}

	return insert.lastInsertRowId;
}

export async function updateExercise(
	id: number,
	patch: Partial<Pick<ExerciseRow, 'name' | 'weight' | 'sets'>>,
) {
	const db = await getDb();

	const current = await db.getFirstAsync<ExerciseSnapshot>(
		'SELECT id, weight, record, sets FROM exercises WHERE id = ?;',
		id,
	);

	if (!current) {
		return;
	}

	const nextWeight = patch.weight ?? current.weight;
	const nextSets = patch.sets ?? current.sets;
	const nextName = patch.name;
	const nextRecord = Math.max(current.record, nextWeight);

	if (typeof nextName === 'string') {
		await db.runAsync(
			'UPDATE exercises SET name = ?, weight = ?, sets = ?, record = ? WHERE id = ?;',
			nextName,
			nextWeight,
			nextSets,
			nextRecord,
			id,
		);
	} else {
		await db.runAsync(
			'UPDATE exercises SET weight = ?, sets = ?, record = ? WHERE id = ?;',
			nextWeight,
			nextSets,
			nextRecord,
			id,
		);
	}

	if (nextWeight !== current.weight) {
		await db.runAsync(
			'INSERT INTO history (exercise_id, date, weight, sets) VALUES (?, ?, ?, ?);',
			id,
			new Date().toISOString(),
			nextWeight,
			nextSets,
		);
	}
}

export async function adjustExerciseWeight(id: number, delta: number) {
	const db = await getDb();
	const current = await db.getFirstAsync<ExerciseSnapshot>(
		'SELECT id, weight, record, sets FROM exercises WHERE id = ?;',
		id,
	);

	if (!current) {
		return;
	}

	const nextWeight = Math.max(0, roundToStep(current.weight + delta, 2.5));
	const nextRecord = Math.max(current.record, nextWeight);

	await db.runAsync('UPDATE exercises SET weight = ?, record = ? WHERE id = ?;', nextWeight, nextRecord, id);

	if (nextWeight !== current.weight) {
		await db.runAsync(
			'INSERT INTO history (exercise_id, date, weight, sets) VALUES (?, ?, ?, ?);',
			id,
			new Date().toISOString(),
			nextWeight,
			current.sets,
		);
	}
}

export async function deleteExercise(id: number) {
	const db = await getDb();
	await db.runAsync('DELETE FROM exercises WHERE id = ?;', id);
}

export async function reorderExercises(idsInOrder: number[]) {
	if (!idsInOrder.length) {
		return;
	}

	const db = await getDb();
	const sql = idsInOrder
		.map((id, index) => `UPDATE exercises SET "order" = ${index} WHERE id = ${id};`)
		.join('\n');
	await db.execAsync(sql);
}
