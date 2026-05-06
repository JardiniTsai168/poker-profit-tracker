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

export const initDB = (): Promise<IDBPDatabase<PokerDB>> => {
  if (!dbPromise) {
    dbPromise = openDB<PokerDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('by-date', 'date');
        store.createIndex('by-game-type', 'gameType');
        store.createIndex('by-location', 'location');
      },
    });
  }
  return dbPromise;
};

export const createSession = async (session: Omit<PokerSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> => {
  const db = await initDB();
  const now = new Date().toISOString();
  const newSession = {
    ...session,
    createdAt: now,
    updatedAt: now,
  };
  const id = await db.add(STORE_NAME, newSession);
  return id;
};

export const getAllSessions = async (): Promise<PokerSession[]> => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
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

export const searchSessions = async (filters: {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  gameType?: string;
  location?: string;
  profitFilter?: 'all' | 'positive' | 'negative';
}): Promise<PokerSession[]> => {
  const db = await initDB();
  const allSessions = await db.getAll(STORE_NAME);
  
  return allSessions.filter(session => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        session.location.toLowerCase().includes(searchLower) ||
        session.gameType.toLowerCase().includes(searchLower) ||
        (session.notes && session.notes.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }
    
    if (filters.dateFrom && session.date < filters.dateFrom) return false;
    if (filters.dateTo && session.date > filters.dateTo) return false;
    if (filters.gameType && session.gameType !== filters.gameType) return false;
    if (filters.location && session.location !== filters.location) return false;
    
    if (filters.profitFilter && filters.profitFilter !== 'all') {
      if (filters.profitFilter === 'positive' && session.profit <= 0) return false;
      if (filters.profitFilter === 'negative' && session.profit >= 0) return false;
    }
    
    return true;
  });
};
