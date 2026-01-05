import { describe, it, expect, vi } from 'vitest';
import { POST } from './+server';
import { scenarioService } from '$lib/server/scenario';

vi.mock('$lib/server/scenario', () => ({
    scenarioService: {
        expand: vi.fn(),
    },
}));

describe('API Route: /api/scenario/[id]/expand', () => {
    it('should return an expanded scenario on success', async () => {
        const mockScenario = { _id: '123', prompt: 'test', words: [{ word: 'w1' }, { word: 'w2' }] };
        (scenarioService.expand as any).mockResolvedValue(mockScenario);

        const response = await POST({ params: { id: '123' } } as any);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual(mockScenario);
        expect(scenarioService.expand).toHaveBeenCalledWith('123');
    });

    it('should return 400 if ID is missing', async () => {
        const response = await POST({ params: {} } as any);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.error).toBe('ID is required');
    });

    it('should return 500 on expansion failure', async () => {
        (scenarioService.expand as any).mockRejectedValue(new Error('AI failed'));

        const response = await POST({ params: { id: '123' } } as any);
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body.error).toBe('Failed to expand scenario');
    });
});
