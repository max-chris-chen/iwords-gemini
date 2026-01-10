import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ObjectId } from 'mongodb';

// Mock dependencies
vi.mock('./db');

describe('Migrations', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    it('should mark scenarios without ownerId as public', async () => {
        const updateManyMock = vi.fn().mockResolvedValue({ modifiedCount: 5, matchedCount: 5 });
        const collectionMock = { updateMany: updateManyMock };
        const dbMock = { collection: vi.fn().mockReturnValue(collectionMock) };
        const clientMock = { db: vi.fn().mockReturnValue(dbMock) };

        vi.doMock('./db', () => ({
            default: Promise.resolve(clientMock)
        }));

        // We expect the module 'migrations.ts' to export this function
        // It doesn't exist yet, so this import will fail if not handled, but for TDD strictness:
        // Typescript might complain, so we might need to create the file first or suppress.
        // For this environment, I'll create the empty file first in the implementation step, 
        // but since I'm running tests via 'run_shell_command' I can just expect it to fail compilation or runtime.
        
        // However, to strictly follow "Write Failing Tests", I need the file to exist so the test RUNS and fails assertions (or compilation).
        // If the file is missing, Vitest errors out on "failed to resolve import".
        
        // I'll assume I create the file in the next step. 
        // But the prompt says "Run the tests and confirm that they fail as expected."
        // So I must create the file first, even if empty.
        
        const { migrateLegacyScenarios } = await import('./migrations');
        
        const result = await migrateLegacyScenarios();

        expect(clientMock.db).toHaveBeenCalledWith('iwords');
        expect(dbMock.collection).toHaveBeenCalledWith('scenarios');
        
        expect(updateManyMock).toHaveBeenCalledWith(
            { 
                ownerId: { $exists: false }
            },
            { $set: { isPublic: true } }
        );
        
        expect(result).toEqual({ modifiedCount: 5, matchedCount: 5 });
    });
});
