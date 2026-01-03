import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MongoClient } from 'mongodb';

// Mock dotenv to prevent it from reading the real .env file in tests
vi.mock('dotenv', () => ({
    config: () => { /* do nothing */ }
}));

// Mock MongoClient
vi.mock('mongodb', () => {
    const connectMock = vi.fn().mockResolvedValue('connected');
    const MongoClientMock = vi.fn(function (this: any, url: string) {
        this.url = url;
        return {
            connect: connectMock
        };
    });
    // Ensure the mock is treated as a constructor
    MongoClientMock.prototype.connect = connectMock;
    
    return {
        MongoClient: MongoClientMock
    };
});

describe('Database Connection', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        process.env.MONGO_URI = 'mongodb://localhost:27017/test_db';
    });

    it('should create a MongoClient with the URI from env', async () => {
        const { default: clientPromise } = await import('./db');
        // We don't await the promise here, just trigger the import
        expect(MongoClient).toHaveBeenCalledWith('mongodb://localhost:27017/test_db');
    });

    it('should export a promise that resolves to the client', async () => {
        const { default: clientPromise } = await import('./db');
        await expect(clientPromise).resolves.toBe('connected');
    });
});

