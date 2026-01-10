import { describe, it, expect, vi } from 'vitest';
import { POST } from './+server';
import { scenarioService } from '$lib/server/scenario';

vi.mock('$lib/server/scenario', () => ({
    scenarioService: {
        generate: vi.fn(),
    },
}));

describe('API Route: /api/generate', () => {
    it('should return a generated scenario on success', async () => {
        const mockScenario = { prompt: 'test', words: [] };
        (scenarioService.generate as any).mockResolvedValue(mockScenario);

        const request = new Request('http://localhost/api/generate', {
            method: 'POST',
            body: JSON.stringify({ prompt: 'test' }),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await POST({ request, locals: {} } as any);
        const body = await response.json();

        expect(response.status).toBe(201);
        expect(body).toEqual(mockScenario);
        expect(scenarioService.generate).toHaveBeenCalledWith('test', undefined);
    });

    it('should pass ownerId from session if logged in', async () => {
        const mockScenario = { prompt: 'test', words: [], ownerId: 'user-123' };
        (scenarioService.generate as any).mockResolvedValue(mockScenario);

        const request = new Request('http://localhost/api/generate', {
            method: 'POST',
            body: JSON.stringify({ prompt: 'test' }),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await POST({ request, locals: { user: { id: 'user-123' } } } as any);
        const body = await response.json();

        expect(response.status).toBe(201);
        expect(scenarioService.generate).toHaveBeenCalledWith('test', 'user-123');
    });

    it('should return 400 for an invalid prompt', async () => {
        const request = new Request('http://localhost/api/generate', {
            method: 'POST',
            body: JSON.stringify({ prompt: 123 }), // invalid type
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await POST({ request, locals: {} } as any);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.error).toBe('Invalid prompt provided');
    });

    it('should return 500 on generation failure', async () => {
        (scenarioService.generate as any).mockRejectedValue(new Error('AI failed'));

        const request = new Request('http://localhost/api/generate', {
            method: 'POST',
            body: JSON.stringify({ prompt: 'fail' }),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await POST({ request, locals: {} } as any);
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body.error).toBe('Failed to generate scenario');
    });
});
