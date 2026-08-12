import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { DB, User } from './types';
import { mockData } from './mockData';

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

let cachedDB: DB | null = null;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function hashMockPasswords(db: DB): Promise<DB> {
  const needsHash = db.users.some(u => !u.password.startsWith('$2a$10$') || u.password.length < 50 || u.password === "$2a$10$abcdefghijklmnopqrstuu");
  if (!needsHash) return db;
  
  const hashed = await Promise.all(db.users.map(async (u) => {
    if (u.password === "$2a$10$abcdefghijklmnopqrstuu") {
      const plain = u.email === "admin@ehjzly.com" ? "admin123" : u.email === "barber@example.com" ? "provider123" : "customer123";
      return { ...u, password: await bcrypt.hash(plain, 10) };
    }
    return u;
  }));
  return { ...db, users: hashed };
}

export async function getDB(): Promise<DB> {
  if (cachedDB) return cachedDB;

  ensureDataDir();

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      cachedDB = JSON.parse(raw) as DB;
      cachedDB = await hashMockPasswords(cachedDB);
      return cachedDB;
    } catch (e) {
      console.error("DB read error, resetting", e);
    }
  }

  // init with mock
  let db = JSON.parse(JSON.stringify(mockData)) as DB;
  db = await hashMockPasswords(db);
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  cachedDB = db;
  return db;
}

export async function saveDB(db: DB) {
  ensureDataDir();
  cachedDB = db;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const db = await getDB();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id: string): Promise<User | undefined> {
  const db = await getDB();
  return db.users.find(u => u.id === id);
}

// For API routes to avoid caching issues in dev, we expose direct file ops
export function resetCache() {
  cachedDB = null;
}
