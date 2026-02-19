import { getDb } from '../db/database';

type BackupPayload = {
	routines: Array<{ id: number; name: string; order: number; created_at: string }>;
	exercises: Array<{
		id: number;
		routine_id: number;
		name: string;
		weight: number;
		record: number;
		sets: string;
		order: number;
	}>;
	history: Array<{ id: number; exercise_id: number; date: string; weight: number; sets: string }>;
};

export async function exportDatabaseJson() {
	const db = await getDb();

	const routines = await db.getAllAsync<BackupPayload['routines'][number]>(
		'SELECT id, name, "order", created_at FROM routines ORDER BY "order" ASC;',
	);
	const exercises = await db.getAllAsync<BackupPayload['exercises'][number]>(
		'SELECT id, routine_id, name, weight, record, sets, "order" FROM exercises ORDER BY routine_id ASC, "order" ASC;',
	);
	const history = await db.getAllAsync<BackupPayload['history'][number]>(
		'SELECT id, exercise_id, date, weight, sets FROM history ORDER BY date ASC;',
	);

	return JSON.stringify({ routines, exercises, history }, null, 2);
}

export async function importDatabaseJson(raw: string) {
	const payload = JSON.parse(raw) as BackupPayload;
	const db = await getDb();

	await db.execAsync('DELETE FROM history; DELETE FROM exercises; DELETE FROM routines;');

	for (const routine of payload.routines ?? []) {
		await db.runAsync(
			'INSERT INTO routines (id, name, "order", created_at) VALUES (?, ?, ?, ?);',
			routine.id,
			routine.name,
			routine.order,
			routine.created_at,
		);
	}

	for (const exercise of payload.exercises ?? []) {
		await db.runAsync(
			'INSERT INTO exercises (id, routine_id, name, weight, record, sets, "order") VALUES (?, ?, ?, ?, ?, ?, ?);',
			exercise.id,
			exercise.routine_id,
			exercise.name,
			exercise.weight,
			exercise.record,
			exercise.sets,
			exercise.order,
		);
	}

	for (const item of payload.history ?? []) {
		await db.runAsync(
			'INSERT INTO history (id, exercise_id, date, weight, sets) VALUES (?, ?, ?, ?, ?);',
			item.id,
			item.exercise_id,
			item.date,
			item.weight,
			item.sets,
		);
	}
}
