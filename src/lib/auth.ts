import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { findUserByEmail, findUserById, getDB, saveDB } from './db';
import { User } from './types';

const COOKIE_NAME = 'ehjzly_session';
const SESSION_SECRET = 'ehjzly_2024_secure_secret_ramadi';

// Simple JWT-like encoding without external lib (to avoid extra deps)
function encode(data: any): string {
  const payload = JSON.stringify(data);
  const base = Buffer.from(payload).toString('base64url');
  // simple signature
  const sig = Buffer.from(base + SESSION_SECRET).toString('base64url').slice(0, 16);
  return `${base}.${sig}`;
}

function decode(token: string): any | null {
  try {
    const [base, sig] = token.split('.');
    if (!base || !sig) return null;
    const expectedSig = Buffer.from(base + SESSION_SECRET).toString('base64url').slice(0, 16);
    if (sig !== expectedSig) return null;
    const payload = Buffer.from(base, 'base64url').toString('utf-8');
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}

export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export async function login(email: string, password: string): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await verifyPassword(password, user.password);
  if (!ok) return null;
  return user;
}

export async function register(data: { name: string; email: string; password: string; role: User['role']; phone?: string }): Promise<User> {
  const db = await getDB();
  const exists = db.users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
  if (exists) throw new Error('البريد الالكتروني مستخدم مسبقاً');
  
  const hashed = await hashPassword(data.password);
  const newUser: User = {
    id: 'u' + Date.now(),
    name: data.name,
    email: data.email,
    password: hashed,
    role: data.role,
    phone: data.phone,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  await saveDB(db);
  return newUser;
}

export async function setSessionCookie(userId: string) {
  const cookieStore = await cookies();
  const token = encode({ userId, iat: Date.now() });
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const data = decode(token);
    if (!data?.userId) return null;
    // check expiry 7 days
    if (Date.now() - data.iat > 7 * 24 * 60 * 60 * 1000) return null;
    const user = await findUserById(data.userId);
    return user || null;
  } catch {
    return null;
  }
}

// Client helper for API
export function getTokenFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

export function decodeToken(token: string) {
  return decode(token);
}
