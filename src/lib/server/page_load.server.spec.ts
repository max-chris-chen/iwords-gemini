import { describe, it, expect, vi } from 'vitest';
import { load } from '../../routes/+page.server';
import { scenarioService } from './scenario';

vi.mock('./scenario');

describe('Homepage Load', () => {
    it('should load public scenarios', async () => {
        const mockScenarios = [{ _id: '1', prompt: 'test' }];
        (scenarioService.list as any).mockResolvedValue(mockScenarios);

        const result = await load({} as any);

        expect(scenarioService.list).toHaveBeenCalledWith({ isPublic: true });
        expect(result).toEqual({
            scenarios: mockScenarios,
        });
    });
});