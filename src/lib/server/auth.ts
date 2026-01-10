import clientPromise from './db';
import type { User, Captcha } from '../models/types';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import type { Cookies } from '@sveltejs/kit';

export const USERS_COLLECTION = 'users';
export const CAPTCHAS_COLLECTION = 'captchas';

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function verifyCaptchaFromCookies(cookies: Cookies, answer: string): Promise<boolean> {
    const token = cookies.get('captcha-token');
    if (!token) return false;
    
    const isValid = await verifyCaptcha(token, answer.toLowerCase());
    
    // Optionally delete the captcha after verification (one-time use)
    if (isValid) {
        cookies.delete('captcha-token', { path: '/' });
    }
    
    return isValid;
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const client = await clientPromise;
    const db = client.db('iwords');
    const user = await db.collection<User>(USERS_COLLECTION).findOne({ email });
    return user;
}

export async function findUserByUsername(username: string): Promise<User | null> {
    const client = await clientPromise;
    const db = client.db('iwords');
    const user = await db.collection<User>(USERS_COLLECTION).findOne({ username });
    return user;
}

export async function findUserById(id: string): Promise<User | null> {
    const client = await clientPromise;
    const db = client.db('iwords');
    if (!ObjectId.isValid(id)) return null;
    const user = await db.collection<User>(USERS_COLLECTION).findOne({ _id: new ObjectId(id) });
    return user;
}

export async function createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const client = await clientPromise;
    const db = client.db('iwords');
    
    const now = new Date();
    const newUser: User = {
        ...userData,
        createdAt: now,
        updatedAt: now,
    };

    const result = await db.collection<User>(USERS_COLLECTION).insertOne(newUser as any); // Type assertion needed sometimes with MongoDB driver types
    
    return { ...newUser, _id: result.insertedId.toString() };
}

export async function storeCaptcha(token: string, answer: string): Promise<void> {
    const client = await clientPromise;
    const db = client.db('iwords');
    
    // Ensure TTL index exists (idempotent)
    // In a real app, this should probably be done in a migration or startup script,
    // but for this implementation, we'll ensure it here or rely on manual setup.
    // For now, let's just insert.
    // NOTE: We should actually ensure the index exists. 
    // Let's do it lazily or assume it's done. 
    // To strictly follow the plan "Create Captcha schema... with TTL index", 
    // I should create the index.
    
    // Check if index exists or just call createIndex which is relatively cheap if it exists.
    // 5 minutes = 300 seconds
    await db.collection(CAPTCHAS_COLLECTION).createIndex({ createdAt: 1 }, { expireAfterSeconds: 300 });
    
    await db.collection<Captcha>(CAPTCHAS_COLLECTION).insertOne({
        token,
        answer,
        createdAt: new Date()
    } as any);
}

export async function verifyCaptcha(token: string, answer: string): Promise<boolean> {
    const client = await clientPromise;
    const db = client.db('iwords');
    
    const captcha = await db.collection<Captcha>(CAPTCHAS_COLLECTION).findOne({ token });
    
    if (!captcha) {
        return false;
    }
    
    // Case-insensitive comparison for better UX?
    // The spec didn't specify, but usually CAPTCHAs are case-insensitive.
    // svg-captcha options often include 'ignoreChars' etc.
    // Let's assume strict for now as per test, or case-insensitive if we want to be nice.
    // The test expects strict matching ('abcd' vs 'abcd').
    
    return captcha.answer === answer;
}
