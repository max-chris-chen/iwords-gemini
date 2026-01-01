import { describe, it, expect, vi, beforeEach } from 'vitest';
// We will implement this module next
import { generateScenario } from './scenario';
import * as ai from './ai';

vi.mock('./ai');

describe('Scenario Generation Logic', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should generate a scenario with words from a prompt', async () => {
        const mockAiResponse = JSON.stringify({
            words: [
                {
                    word: 'apple',
                    definition: 'A fruit',
                    phonetics: '/apple/',
                    examples: [{ en: 'I eat an apple.', cn: '我吃苹果。' }]
                }
            ]
        });

        (ai.generateContent as any).mockResolvedValue(mockAiResponse);

        const prompt = 'fruit';
        const result = await generateScenario(prompt);

        expect(ai.generateContent).toHaveBeenCalledWith(expect.stringContaining('fruit'));
        expect(ai.generateContent).toHaveBeenCalledWith(expect.stringContaining('JSON'));
        expect(result.prompt).toBe('fruit');
        expect(result.words).toHaveLength(1);
        expect(result.words[0].word).toBe('apple');
    });

    it('should handle invalid JSON from AI', async () => {
        (ai.generateContent as any).mockResolvedValue('Not JSON');
        await expect(generateScenario('test')).rejects.toThrow();
    });
});
