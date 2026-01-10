import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH } from './+server';
import { scenarioService } from '$lib/server/scenario';

vi.mock('$lib/server/scenario', () => ({
    scenarioService: {
        getById: vi.fn(),
        save: vi.fn()
    }
}));

describe('PATCH /api/scenario/[id]', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should update isPublic if user is the owner', async () => {
        const scenarioId = 'scen-1';
        const ownerId = 'user-1';
        const mockScenario = { _id: scenarioId, ownerId, isPublic: false };
        
        (scenarioService.getById as any).mockResolvedValue(mockScenario);
        (scenarioService.save as any).mockResolvedValue({ ...mockScenario, isPublic: true });

        const request = new Request('http://localhost', {
            method: 'PATCH',
            body: JSON.stringify({ isPublic: true })
        });
        
        const event = {
            params: { id: scenarioId },
            request,
            locals: { user: { id: ownerId } }
        } as any;

        const response = await PATCH(event);
        const body = await response.json();

        expect(scenarioService.getById).toHaveBeenCalledWith(scenarioId);
        expect(scenarioService.save).toHaveBeenCalledWith(expect.objectContaining({
            isPublic: true
        }));
        expect(response.status).toBe(200);
        expect(body.isPublic).toBe(true);
    });

    it('should return 403 if user is not the owner', async () => {
        const scenarioId = 'scen-1';
        const mockScenario = { _id: scenarioId, ownerId: 'other-user', isPublic: false };
        
        (scenarioService.getById as any).mockResolvedValue(mockScenario);

        const request = new Request('http://localhost', {
            method: 'PATCH',
            body: JSON.stringify({ isPublic: true })
        });
        
        const event = {
            params: { id: scenarioId },
            request,
            locals: { user: { id: 'me' } }
        } as any;

        const response = await PATCH(event);
        expect(response.status).toBe(403);
    });
});
