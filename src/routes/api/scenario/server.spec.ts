import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './+server';
import { scenarioService } from '$lib/server/scenario';

vi.mock('$lib/server/scenario', () => ({
    scenarioService: {
        list: vi.fn()
    }
}));

describe('GET /api/scenario', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return only public scenarios', async () => {
        const mockScenarios = [{ _id: '1', prompt: 'test', isPublic: true }];
        (scenarioService.list as any).mockResolvedValue(mockScenarios);

        const response = await GET({} as any);
        const body = await response.json();

        expect(scenarioService.list).toHaveBeenCalledWith({ isPublic: true });
        expect(response.status).toBe(200);
        expect(body).toEqual(mockScenarios);
    });

    it('should return 500 if list fails', async () => {
        (scenarioService.list as any).mockRejectedValue(new Error('DB Error'));

        const response = await GET({} as any);
        expect(response.status).toBe(500);
    });
});
