import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveScenario } from './storage';

const { mockClient, mockInsertOne, mockCollection } = vi.hoisted(() => {
    const mockInsertOne = vi.fn();
    const mockCollection = vi.fn().mockReturnValue({ insertOne: mockInsertOne });
    const mockDb = { collection: mockCollection };
    const mockClient = { db: vi.fn().mockReturnValue(mockDb) };
    return { mockClient, mockInsertOne, mockCollection };
});

vi.mock('./db', () => ({
    default: Promise.resolve(mockClient)
}));

describe('Storage Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockInsertOne.mockResolvedValue({ insertedId: 'mock-id' });
        // Restore default behavior
        mockCollection.mockReturnValue({ insertOne: mockInsertOne });
        mockClient.db.mockReturnValue({ collection: mockCollection });
    });

    it('should save scenario to scenarios collection', async () => {
        const scenario = {
            prompt: 'test',
            createdAt: new Date(),
            words: []
        };

        const result = await saveScenario(scenario as any);

        expect(mockClient.db).toHaveBeenCalled();
        expect(mockCollection).toHaveBeenCalledWith('scenarios');
        expect(mockInsertOne).toHaveBeenCalledWith(scenario);
        expect(result).toBe('mock-id');
    });
});