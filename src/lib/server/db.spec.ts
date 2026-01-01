import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MongoClient } from 'mongodb';

// Mock the environment variable
vi.mock('$env/static/private', () => ({
    MONGO_URI: 'mongodb://localhost:27017/test_db'
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
        vi.clearAllMocks();
        // Reset modules to ensure the db module is re-evaluated
        vi.resetModules();
    });

    it('should create a MongoClient with the URI from env', async () => {
        const clientPromise = (await import('./db')).default;
        expect(MongoClient).toHaveBeenCalledWith('mongodb://localhost:27017/test_db');
    });

    it('should export a promise that resolves to the client', async () => {
        const clientPromise = (await import('./db')).default;
        await expect(clientPromise).resolves.toBe('connected');
    });
});
