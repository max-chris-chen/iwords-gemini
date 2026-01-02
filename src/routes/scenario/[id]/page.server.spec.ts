import { describe, it, expect, vi } from 'vitest';
import { load } from './+page.server';
import { scenarioService } from '$lib/server/scenario';
import { transformScenarioToFlowData } from '$lib/mindmap';
import { error } from '@sveltejs/kit';

vi.mock('$lib/server/scenario');
vi.mock('$lib/mindmap');

describe('Scenario Page Load', () => {
    it('should load scenario data and transform it for the mind map', async () => {
        const scenarioId = 'test-id';
        const mockScenario = { _id: scenarioId, prompt: 'test', words: [] };
        const mockFlowData = { nodes: [{ id: '1' }], edges: [{ id: 'e1' }] };

        (scenarioService.getById as any).mockResolvedValue(mockScenario);
        (transformScenarioToFlowData as any).mockReturnValue(mockFlowData);

        const event = { params: { id: scenarioId } };
        const result = await load(event as any);

        expect(scenarioService.getById).toHaveBeenCalledWith(scenarioId);
        expect(transformScenarioToFlowData).toHaveBeenCalledWith(mockScenario);
        expect(result).toEqual({
            scenario: mockScenario,
            nodes: mockFlowData.nodes,
            edges: mockFlowData.edges,
        });
    });

    it('should throw a 404 error if scenario is not found', async () => {
        const scenarioId = 'not-found-id';
        (scenarioService.getById as any).mockResolvedValue(null);

        const event = { params: { id: scenarioId } };
        
        try {
            await load(event as any);
            // If it doesn't throw, fail the test
            expect.fail('load() should have thrown an error');
        } catch (e: any) {
            expect(e.status).toBe(404);
            expect(e.body.message).toBe('Scenario not found');
        }
    });
});
