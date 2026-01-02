// src/routes/+page.server.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { load } from './+page.server';
import { scenarioService } from '$lib/server/scenario';

vi.mock('$lib/server/scenario');

describe('Homepage Load', () => {
    it('should load all scenarios', async () => {
        const mockScenarios = [{ _id: '1', prompt: 'test' }];
        (scenarioService.getAll as any).mockResolvedValue(mockScenarios);

        const result = await load();

        expect(scenarioService.getAll).toHaveBeenCalled();
        expect(result).toEqual({
            scenarios: mockScenarios,
        });
    });
});
