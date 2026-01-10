import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Scenario } from '../models/types';
import { ObjectId } from 'mongodb';

// Mock everything required
vi.mock('./ai');

describe('Scenario Schema Support', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    it('should save and retrieve scenario with ownerId and isPublic fields', async () => {
        const mockId = new ObjectId();
        const mockDate = new Date();
        const mockScenario: Scenario = {
            prompt: 'private scenario',
            createdAt: mockDate,
            words: [],
            ownerId: 'user-123',
            isPublic: false
        };

        const insertOneMock = vi.fn().mockImplementation(async (doc) => {
            doc._id = mockId;
            return { acknowledged: true, insertedId: mockId };
        });
        
        const findOneMock = vi.fn().mockImplementation(async (query) => {
             // Return what we effectively "inserted"
             return {
                 _id: mockId,
                 prompt: 'private scenario',
                 createdAt: mockDate,
                 words: [],
                 ownerId: 'user-123',
                 isPublic: false
             };
        });

        const collectionMock = { 
            insertOne: insertOneMock,
            findOne: findOneMock
        };
        const dbMock = { collection: vi.fn().mockReturnValue(collectionMock) };
        const clientMock = { db: vi.fn().mockReturnValue(dbMock) };

        vi.doMock('./db', () => ({
            default: Promise.resolve(clientMock)
        }));

        const { scenarioService } = await import('./scenario');

        // Test Save
        const saved = await scenarioService.save(mockScenario);
        
        expect(insertOneMock).toHaveBeenCalledWith(expect.objectContaining({
            ownerId: 'user-123',
            isPublic: false
        }));
        expect(saved.ownerId).toBe('user-123');
        expect(saved.isPublic).toBe(false);

        // Test GetById
        const retrieved = await scenarioService.getById(mockId.toHexString());
        
        expect(retrieved).not.toBeNull();
        if (retrieved) {
            expect(retrieved.ownerId).toBe('user-123');
            expect(retrieved.isPublic).toBe(false);
        }
    });
});
