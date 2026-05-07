import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { PokerSession } from './types';

interface PokerDB extends DBSchema {
  sessions: {
    key: number;
    value: PokerSession;
    indexes: {
      'by-date': string;
      'by-game-type': string;
      'by-location': string;
    };
  };
}

const DB_NAME = 'poker-profit-tracker';
const DB_VERSION = 1;
const STORE_NAME = 'sessions';

let dbPromise: Promise<IDBPDatabase<PokerDB>> | null = null;

export const initDB = async (): Promise<IDBPDatabase<PokerDB>> => {
  if (!dbPromise) {
    console.log('[DB] Initializing IndexedDB...');
    try {
      dbPromise = openDB<PokerDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          console.log('[DB] Upgrading database...');
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('by-date', 'date');
          store.createIndex('by-game-type', 'gameType');
          store.createIndex('by-location', 'location');
        },
      });
      console.log('[DB] IndexedDB initialized');
    } catch (error) {
      console.error('[DB] Failed to initialize:', error);
      throw error;
    }
  }
  return dbPromise;
};

export const createSession = async (session: Omit<PokerSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> => {
  console.log('[DB] Creating session...');
  const db = await initDB();
  const now = new Date().toISOString();
  const newSession = {
    ...session,
    createdAt: now,
    updatedAt: now,
  };
  const id = await db.add(STORE_NAME, newSession);
  console.log('[DB] Session created with ID:', id);
  return id;
};

export const getAllSessions = async (): Promise<PokerSession[]> => {
  console.log('[DB] Getting all sessions...');
  try {
    const db = await initDB();
    const sessions = await db.getAll(STORE_NAME);
    console.log('[DB] Got', sessions.length, 'sessions');
    return sessions;
  } catch (error) {
    console.error('[DB] Error getting sessions:', error);
    return [];
  }
};

export const getSessionById = async (id: number): Promise<PokerSession | undefined> => {
  const db = await initDB();
  return db.get(STORE_NAME, id);
};

export const updateSession = async (id: number, updates: Partial<PokerSession>): Promise<void> => {
  const db = await initDB();
  const existing = await db.get(STORE_NAME, id);
  if (!existing) {
    throw new Error(`Session ${id} not found`);
  }
  const updated = {
    ...existing,
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };
  await db.put(STORE_NAME, updated);
};

export const deleteSession = async (id: number): Promise<void> => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};
