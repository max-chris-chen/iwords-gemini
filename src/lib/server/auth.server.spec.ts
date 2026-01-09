import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { User, Captcha } from '../models/types';
import { ObjectId } from 'mongodb';

// Mocks - Defined BEFORE imports
const mockCollection = {
    findOne: vi.fn(),
    insertOne: vi.fn(),
    createIndex: vi.fn(),
};

const mockDb = {
    collection: vi.fn().mockReturnValue(mockCollection),
};

const mockClient = {
    db: vi.fn().mockReturnValue(mockDb),
};

// Use doMock to avoid hoisting issues with external variables
vi.doMock('./db', () => ({
    default: Promise.resolve(mockClient),
}));

// Import subject under test using dynamic import or require
// but since we are in module mode, we use dynamic import in beforeEach or top level await if supported.
// Actually, with doMock, we need to import AFTER doMock.
const authService = await import('./auth');

describe('Auth Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('findUserByEmail', () => {
        it('should return a user if found', async () => {
            const mockUser: User = {
                username: 'testuser',
                email: 'test@example.com',
                mobile: '1234567890',
                passwordHash: 'hash',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockCollection.findOne.mockResolvedValue(mockUser);

            const result = await authService.findUserByEmail('test@example.com');

            expect(mockDb.collection).toHaveBeenCalledWith('users');
            expect(mockCollection.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(result).toEqual(mockUser);
        });

        it('should return null if user not found', async () => {
            mockCollection.findOne.mockResolvedValue(null);

            const result = await authService.findUserByEmail('notfound@example.com');

            expect(result).toBeNull();
        });
    });

    describe('findUserByUsername', () => {
        it('should return a user if found', async () => {
            const mockUser: User = {
                username: 'testuser',
                email: 'test@example.com',
                mobile: '1234567890',
                passwordHash: 'hash',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockCollection.findOne.mockResolvedValue(mockUser);

            const result = await authService.findUserByUsername('testuser');

            expect(mockDb.collection).toHaveBeenCalledWith('users');
            expect(mockCollection.findOne).toHaveBeenCalledWith({ username: 'testuser' });
            expect(result).toEqual(mockUser);
        });

        it('should return null if user not found', async () => {
            mockCollection.findOne.mockResolvedValue(null);

            const result = await authService.findUserByUsername('nonexistent');

            expect(result).toBeNull();
        });
    });

    describe('createUser', () => {
        it('should insert a new user and return it', async () => {
            const newUserInput = {
                username: 'newuser',
                email: 'new@example.com',
                mobile: '0987654321',
                passwordHash: 'hashedpassword',
            };
            
            const insertedId = new ObjectId();
            mockCollection.insertOne.mockResolvedValue({ insertedId, acknowledged: true });

            const result = await authService.createUser(newUserInput);

            expect(mockDb.collection).toHaveBeenCalledWith('users');
            expect(mockCollection.insertOne).toHaveBeenCalledWith(expect.objectContaining({
                ...newUserInput,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            }));
            expect(result).toEqual(expect.objectContaining(newUserInput));
        });
    });
    
    describe('storeCaptcha', () => {
        it('should store a captcha with token and answer', async () => {
            const token = 'some-uuid';
            const answer = 'abcd';
            
             mockCollection.insertOne.mockResolvedValue({ acknowledged: true });
             
             await authService.storeCaptcha(token, answer);
             
             expect(mockDb.collection).toHaveBeenCalledWith('captchas');
             expect(mockCollection.insertOne).toHaveBeenCalledWith(expect.objectContaining({
                 token,
                 answer,
                 createdAt: expect.any(Date)
             }));
        });
    });

    describe('verifyCaptcha', () => {
         it('should return true if token and answer match', async () => {
            const token = 'valid-token';
            const answer = 'abcd';
            
            mockCollection.findOne.mockResolvedValue({ token, answer: 'abcd' }); // Case sensitive check in DB usually, but we might want case insensitive logic
            
            const isValid = await authService.verifyCaptcha(token, 'abcd');
            
            expect(mockDb.collection).toHaveBeenCalledWith('captchas');
            expect(mockCollection.findOne).toHaveBeenCalledWith({ token });
            expect(isValid).toBe(true);
        });

        it('should return false if token not found', async () => {
             mockCollection.findOne.mockResolvedValue(null);
             const isValid = await authService.verifyCaptcha('invalid', 'abcd');
             expect(isValid).toBe(false);
        });
        
        it('should return false if answer does not match', async () => {
             mockCollection.findOne.mockResolvedValue({ token: 't', answer: 'abcd' });
             const isValid = await authService.verifyCaptcha('t', 'wrong');
             expect(isValid).toBe(false);
        });
    });

    describe('verifyCaptchaFromCookies', () => {
        it('should return true and delete cookie if valid', async () => {
            const mockCookies = {
                get: vi.fn().mockReturnValue('token123'),
                delete: vi.fn()
            };
            mockCollection.findOne.mockResolvedValue({ token: 'token123', answer: 'abcd' });

            const isValid = await authService.verifyCaptchaFromCookies(mockCookies as any, 'ABCD'); // Test case insensitivity

            expect(isValid).toBe(true);
            expect(mockCookies.get).toHaveBeenCalledWith('captcha-token');
            expect(mockCookies.delete).toHaveBeenCalledWith('captcha-token', { path: '/' });
        });

        it('should return false if no token in cookies', async () => {
            const mockCookies = {
                get: vi.fn().mockReturnValue(undefined)
            };
            const isValid = await authService.verifyCaptchaFromCookies(mockCookies as any, 'abcd');
            expect(isValid).toBe(false);
        });
    });

    describe('Password Utils', () => {
        it('should hash a password', async () => {
            const password = 'mysecretpassword';
            const hash = await authService.hashPassword(password);
            expect(hash).not.toBe(password);
            expect(hash).toHaveLength(60); // Bcrypt hashes are usually 60 chars
        });

        it('should verify a correct password', async () => {
            const password = 'mysecretpassword';
            const hash = await authService.hashPassword(password);
            const isValid = await authService.verifyPassword(password, hash);
            expect(isValid).toBe(true);
        });

        it('should reject an incorrect password', async () => {
            const password = 'mysecretpassword';
            const hash = await authService.hashPassword(password);
            const isValid = await authService.verifyPassword('wrongpassword', hash);
            expect(isValid).toBe(false);
        });
    });
});
