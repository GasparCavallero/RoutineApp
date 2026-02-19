import { getDb } from './database';

export type RoutineRow = {
	id: number;
	name: string;
	order: number;
	created_at: string;
};

export async function getRoutines() {
	const db = await getDb();
	return db.getAllAsync<RoutineRow>(
		'SELECT id, name, "order", created_at FROM routines ORDER BY "order" ASC, id ASC;',
	);
}

export async function createRoutine(name: string) {
	const db = await getDb();
	const result = await db.getFirstAsync<{ maxOrder: number | null }>(
		'SELECT MAX("order") as maxOrder FROM routines;',
	);
	const nextOrder = (result?.maxOrder ?? -1) + 1;

	const insert = await db.runAsync(
		'INSERT INTO routines (name, "order", created_at) VALUES (?, ?, ?);',
		name,
		nextOrder,
		new Date().toISOString(),
	);

	return insert.lastInsertRowId;
}

export async function renameRoutine(id: number, name: string) {
	const db = await getDb();
	await db.runAsync('UPDATE routines SET name = ? WHERE id = ?;', name, id);
}

export async function deleteRoutine(id: number) {
	const db = await getDb();
	await db.runAsync('DELETE FROM routines WHERE id = ?;', id);
}

export async function reorderRoutines(idsInOrder: number[]) {
	if (!idsInOrder.length) {
		return;
	}

	const db = await getDb();
	const sql = idsInOrder
		.map((id, index) => `UPDATE routines SET "order" = ${index} WHERE id = ${id};`)
		.join('\n');
	await db.execAsync(sql);
}
