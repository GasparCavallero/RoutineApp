import { getDb } from './database';

export type HistoryRow = {
	id: number;
	exercise_id: number;
	exercise_name: string;
	routine_id: number;
	routine_name: string;
	date: string;
	weight: number;
	sets: string;
};

export type ProgressPoint = {
	date: string;
	weight: number;
};

export async function getHistory() {
	const db = await getDb();

	return db.getAllAsync<HistoryRow>(`
		SELECT
			h.id,
			h.exercise_id,
			e.name AS exercise_name,
			e.routine_id,
			r.name AS routine_name,
			h.date,
			h.weight,
			h.sets
		FROM history h
		INNER JOIN exercises e ON e.id = h.exercise_id
		INNER JOIN routines r ON r.id = e.routine_id
		ORDER BY h.date DESC;
	`);
}

export async function getProgressByExercise(exerciseId: number) {
	const db = await getDb();

	return db.getAllAsync<ProgressPoint>(
		`
			SELECT h.date, h.weight
			FROM history h
			INNER JOIN exercises e ON e.id = h.exercise_id
			WHERE LOWER(TRIM(e.name)) = (
				SELECT LOWER(TRIM(name))
				FROM exercises
				WHERE id = ?
			)
			ORDER BY h.date ASC;
		`,
		exerciseId,
	);
}
