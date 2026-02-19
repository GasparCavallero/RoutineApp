import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDb() {
	if (!dbPromise) {
		dbPromise = SQLite.openDatabaseAsync('routineapp.db');
	}

	const db = await dbPromise;
	await db.execAsync('PRAGMA foreign_keys = ON;');
	return db;
}

export async function initDatabase() {
	const db = await getDb();

	await db.execAsync(`
		CREATE TABLE IF NOT EXISTS routines (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			"order" INTEGER NOT NULL DEFAULT 0,
			created_at TEXT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS exercises (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			routine_id INTEGER NOT NULL,
			name TEXT NOT NULL,
			weight REAL NOT NULL DEFAULT 0,
			record REAL NOT NULL DEFAULT 0,
			sets TEXT NOT NULL DEFAULT '3x10',
			"order" INTEGER NOT NULL DEFAULT 0,
			FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS history (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			exercise_id INTEGER NOT NULL,
			date TEXT NOT NULL,
			weight REAL NOT NULL,
			sets TEXT NOT NULL,
			FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
		);
	`);
}
