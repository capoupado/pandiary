import { openDatabaseSync } from "expo-sqlite";

const db = openDatabaseSync("clarity.db");

export async function setupDatabase() {
  await db.execAsync(`CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sleep_time TEXT,
        sleep_quality TEXT,
        moods TEXT,
        energy_level TEXT,
        stress_level TEXT,
        body_feel TEXT,
        appetite TEXT,
        focus TEXT,
        motivation TEXT,
        anxiety TEXT,
        others TEXT,
        ai_report TEXT,
        timestamp TEXT
      );

      CREATE TABLE IF NOT EXISTS user_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER,
        weight INTEGER,
        height INTEGER,
        conditions TEXT,
        medications TEXT,
        hobbies TEXT,
        goals TEXT,
        occupation TEXT,
        physical_activity TEXT,
        additional_info TEXT
    );

    CREATE TABLE IF NOT EXISTS thought_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        situation TEXT,
        emotions TEXT,
        automatic_thoughts TEXT,
        evidence_for TEXT,
        evidence_against TEXT,
        alternative_thought TEXT,
        outcome TEXT,
        timestamp TEXT
    );`).catch((error) => {
    console.error("Error setting up database:", error);
    });
  await db.execAsync(
    `CREATE INDEX IF NOT EXISTS idx_entries_timestamp ON entries(timestamp);`
  ).catch(() => {});
  await db.execAsync(
    `CREATE INDEX IF NOT EXISTS idx_thought_logs_timestamp ON thought_logs(timestamp);`
  ).catch(() => {});
}

export async function clearDatabase() {
  await db.execAsync(`DROP TABLE IF EXISTS entries;`);
  await db.execAsync(`DROP TABLE IF EXISTS user_info;`);
  await db.execAsync(`DROP TABLE IF EXISTS thought_logs;`);
  console.log("Database cleared.");
  await setupDatabase();
}

export async function getUserInfo(): Promise<any | null> {
  const result = await db.getAllAsync(`SELECT * FROM user_info LIMIT 1;`);
  return result.length > 0 ? result[0] : null;
}

export async function saveUserInfo(
  userInfo: {
    id?: number; // Optional id for replacing rows
    name: string;
    age: number;
    weight: number;
    height: number;
    conditions: string;
    medications: string;
    hobbies: string;
    goals: string;
    occupation: string;
    physical_activity: string;
    additional_info: string;
  },
  callback?: () => void
): Promise<void> {
  await db.runAsync(
    `INSERT OR REPLACE INTO user_info (id, name, age, weight, height, conditions, medications, hobbies, goals, occupation, physical_activity, additional_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    userInfo.id || null, // Use null for new rows
    userInfo.name,
    userInfo.age,
    userInfo.weight,
    userInfo.height,
    userInfo.conditions,
    userInfo.medications,
    userInfo.hobbies,
    userInfo.goals,
    userInfo.occupation,
    userInfo.physical_activity,
    userInfo.additional_info
  );
  if (callback) callback();
}

export async function saveEntry(
  entry: {
    sleep_time: string;
    sleep_quality: string;
    moods: string;
    energy_level: string;
    stress_level: string;
    body_feel: string;
    appetite: string;
    focus: string;
    motivation: string;
    anxiety: string;
    others: string;
    timestamp: string;
  },
  callback?: () => void
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO entries (sleep_time, sleep_quality, moods, energy_level, stress_level, body_feel, appetite, focus, motivation, anxiety, others, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    entry.sleep_time,
    entry.sleep_quality,
    entry.moods,
    entry.energy_level,
    entry.stress_level,
    entry.body_feel,
    entry.appetite,
    entry.focus,
    entry.motivation,
    entry.anxiety,
    entry.others,
    entry.timestamp
  );

  if (callback) callback();
  // result.lastInsertRowId contains the new id in expo-sqlite
  return result.lastInsertRowId;
}

export async function updateEntry(
  entry: {
    id: number;
    sleep_time: string;
    sleep_quality: string;
    moods: string;
    energy_level: string;
    stress_level: string;
    body_feel: string;
    appetite: string;
    focus: string;
    motivation: string;
    anxiety: string;
    others: string;
    timestamp: string;
  },
  callback?: () => void
) {
  await db.runAsync(
    `UPDATE entries SET sleep_time = ?, sleep_quality = ?, moods = ?, energy_level = ?, stress_level = ?, body_feel = ?, appetite = ?, focus = ?, motivation = ?, anxiety = ?, others = ?, timestamp = ? WHERE id = ?;`,
    entry.sleep_time,
    entry.sleep_quality,
    entry.moods,
    entry.energy_level,
    entry.stress_level,
    entry.body_feel,
    entry.appetite,
    entry.focus,
    entry.motivation,
    entry.anxiety,
    entry.others,
    entry.timestamp,
    entry.id
  );
  if (callback) callback();
}

export async function deleteEntry(id: number, callback?: () => void) {
  await db.runAsync(`DELETE FROM entries WHERE id = ?;`, id);
  if (callback) callback();
}

// Thought Log CRUD
export type ThoughtLog = {
  id?: number;
  situation: string;
  emotions: string; // comma-separated labels or JSON string
  automatic_thoughts: string;
  evidence_for: string;
  evidence_against: string;
  alternative_thought: string;
  outcome: string;
  timestamp: string;
};

export async function saveThoughtLog(
  log: ThoughtLog,
  callback?: () => void
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO thought_logs (situation, emotions, automatic_thoughts, evidence_for, evidence_against, alternative_thought, outcome, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    log.situation,
    log.emotions,
    log.automatic_thoughts,
    log.evidence_for,
    log.evidence_against,
    log.alternative_thought,
    log.outcome,
    log.timestamp
  );
  if (callback) callback();
  return result.lastInsertRowId;
}

export async function updateThoughtLog(
  log: ThoughtLog,
  callback?: () => void
): Promise<void> {
  if (!log.id) throw new Error('Missing id for updateThoughtLog');
  await db.runAsync(
    `UPDATE thought_logs SET situation = ?, emotions = ?, automatic_thoughts = ?, evidence_for = ?, evidence_against = ?, alternative_thought = ?, outcome = ?, timestamp = ? WHERE id = ?;`,
    log.situation,
    log.emotions,
    log.automatic_thoughts,
    log.evidence_for,
    log.evidence_against,
    log.alternative_thought,
    log.outcome,
    log.timestamp,
    log.id
  );
  if (callback) callback();
}

export async function deleteThoughtLog(id: number, callback?: () => void): Promise<void> {
  await db.runAsync(`DELETE FROM thought_logs WHERE id = ?;`, id);
  if (callback) callback();
}

export async function getThoughtLogs(): Promise<ThoughtLog[]> {
  return db.getAllAsync(`SELECT * FROM thought_logs ORDER BY timestamp DESC;`);
}

export async function getThoughtLogById(id: number): Promise<ThoughtLog | null> {
  const rows = await db.getAllAsync(`SELECT * FROM thought_logs WHERE id = ?;`, id);
  return rows.length > 0 ? (rows[0] as ThoughtLog) : null;
}

export async function getEntries(): Promise<any[]> {
  const result = await db.getAllAsync(
    `SELECT * FROM entries ORDER BY timestamp DESC;`
  );
  return result;
}

export async function updateAIReport(
  entryId: number,
  aiReport: string,
  callback?: () => void
): Promise<void> {
  await db.runAsync(
    `UPDATE entries SET ai_report = ? WHERE id = ?;`,
    aiReport,
    entryId
  );
  if (callback) callback();
}

export async function getEntriesFromLastWeek(): Promise<any[]> {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 7);
  start.setHours(0, 0, 0, 0);
  const end = today.toISOString();

  const result = await db.getAllAsync(
    `SELECT * FROM entries WHERE timestamp >= ? AND timestamp < ? ORDER BY timestamp DESC;`,
    start.toISOString(),
    end
  );

  return result;
}

export async function getLastEntry(): Promise<any | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = today.toISOString();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 1);
  const end = endDate.toISOString();

  const result = await db.getAllAsync(
    `SELECT * FROM entries WHERE timestamp >= ? AND timestamp < ? ORDER BY timestamp DESC;`,
    start,
    end
  );

  return result.length > 0 ? result[0] : null;
}

export async function getEntryById(id: number): Promise<any | null> {
  const result = await db.getAllAsync(
    `SELECT * FROM entries WHERE id = ?;`,
    id
  );

  return result.length > 0 ? result[0] : null;
}

// Uncomment the following functions if you want to use the original entry structure
/*export async function saveEntry(
  entry: {
    text: string;
    mood: number;
    tags: string[];
    timestamp: string;
  },
  callback?: () => void
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO entries (text, mood, tags, timestamp) VALUES (?, ?, ?, ?);`,
    entry.text,
    entry.mood,
    JSON.stringify(entry.tags),
    entry.timestamp
  );
  if (callback) callback();
  // result.lastInsertRowId contains the new id in expo-sqlite
  return result.lastInsertRowId;
}

export async function updateEntry(
  entry: {
    id: number;
    text: string;
    mood: number;
    tags: string[];
    timestamp: string;
  },
  callback?: () => void
) {
  await db.runAsync(
    `UPDATE entries SET text = ?, mood = ?, tags = ?, timestamp = ? WHERE id = ?;`,
    entry.text,
    entry.mood,
    JSON.stringify(entry.tags),
    entry.timestamp,
    entry.id
  );
  if (callback) callback();
}

export async function deleteEntry(id: number, callback?: () => void) {
  await db.runAsync(`DELETE FROM entries WHERE id = ?;`, id);
  if (callback) callback();
}

export async function getEntries(): Promise<any[]> {
  const result = await db.getAllAsync(
    `SELECT * FROM entries ORDER BY timestamp DESC;`
  );
  return result;
}

export async function getEntriesFromLastWeek(): Promise<any[]> {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 7);
  start.setHours(0, 0, 0, 0);
  const end = today.toISOString();

  const result = await db.getAllAsync(
    `SELECT * FROM entries WHERE timestamp >= ? AND timestamp < ? ORDER BY timestamp DESC;`,
    start.toISOString(),
    end
  );

  return result;
}

export async function getLastEntry(): Promise<any | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = today.toISOString();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 1);
  const end = endDate.toISOString();

  const result = await db.getAllAsync(
    `SELECT * FROM entries WHERE timestamp >= ? AND timestamp < ? ORDER BY timestamp DESC;`,
    start,
    end
  );

  return result.length > 0 ? result[0] : null;
}

export async function getEntryById(id: number): Promise<any | null> {
  const result = await db.getAllAsync(
    `SELECT * FROM entries WHERE id = ?;`,
    id
  );

  return result.length > 0 ? result[0] : null;
}*/
