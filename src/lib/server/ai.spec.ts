import { describe, it, expect, vi, beforeEach } from 'vitest';
// We will implement this module next
import { generateContent } from './ai';

// Mock env
vi.mock('$env/static/private', () => ({
    DEEPSEEK_API_KEY: 'test-key',
    AI_PROVIDER: 'deepseek'
}));

global.fetch = vi.fn();

describe('AI Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call Deepseek API with correct parameters', async () => {
        const mockResponse = {
            choices: [{ message: { content: 'mock content' } }]
        };
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockResponse
        });

        const prompt = 'test prompt';
        const result = await generateContent(prompt);

        expect(global.fetch).toHaveBeenCalledWith(
            'https://api.deepseek.com/chat/completions',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Authorization': 'Bearer test-key',
                    'Content-Type': 'application/json'
                }),
                body: expect.stringContaining(prompt)
            })
        );
        expect(result).toBe('mock content');
    });

    it('should throw error if API call fails', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: false,
            statusText: 'Bad Request'
        });

        await expect(generateContent('test')).rejects.toThrow('AI API Error: Bad Request');
    });
});
