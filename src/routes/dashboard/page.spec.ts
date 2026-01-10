import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from './+page.server';
import { scenarioService } from '$lib/server/scenario';

vi.mock('$lib/server/scenario', () => ({
    scenarioService: {
        list: vi.fn(),
    },
}));

describe('Dashboard Page Load', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should redirect to login if user is not authenticated', async () => {
        const event = { locals: {} } as any;
        
        try {
            await load(event);
            expect.fail('Should have thrown redirect');
        } catch (e: any) {
            // Check for SvelteKit redirect object structure
            if (e.status === 302 && e.location === '/login') {
                expect(e.status).toBe(302);
            } else {
                throw e; // Rethrow if it's not the expected redirect
            }
        }
    });

    it('should load user scenarios if authenticated', async () => {
        const userId = 'user-123';
        const user = { id: userId, username: 'tester' };
        const mockScenarios = [{ _id: '1', prompt: 'my scenario', ownerId: userId }];
        (scenarioService.list as any).mockResolvedValue(mockScenarios);

        const event = { 
            locals: { user } 
        } as any;

        const result = await load(event);

        expect(scenarioService.list).toHaveBeenCalledWith({ ownerId: userId });
        expect(result).toEqual({ scenarios: mockScenarios, user });
    });
});