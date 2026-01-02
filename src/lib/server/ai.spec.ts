import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dotenv to prevent it from reading the real .env file in tests
vi.mock('dotenv', () => ({
    config: () => { /* do nothing */ }
}));

global.fetch = vi.fn();

describe('AI Service', () => {
    beforeEach(() => {
        vi.resetModules(); // This is key to allow setting env vars per test
        vi.clearAllMocks();
        // Set a default valid key for most tests
        process.env.DEEPSEEK_API_KEY = 'test-key';
    });

    it('should call Deepseek API with correct parameters', async () => {
        const { generateContent } = await import('./ai');
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

    it('should throw a generic error if fetch is rejected', async () => {
        const { generateContent } = await import('./ai');
        (global.fetch as any).mockRejectedValue(new Error('Network Error'));

        await expect(generateContent('test')).rejects.toThrow('AI API Error: Network Error');
    });

    it('should throw a specific error if response is not ok', async () => {
        const { generateContent } = await import('./ai');
        (global.fetch as any).mockResolvedValue({
            ok: false,
            status: 500,
            text: async () => 'Server Error'
        });

        await expect(generateContent('test')).rejects.toThrow('AI service request failed with status 500');
    });

    it('should throw error if API key is missing', async () => {
        process.env.DEEPSEEK_API_KEY = ''; // Unset the key
        const { generateContent } = await import('./ai');
        await expect(generateContent('test')).rejects.toThrow('Invalid/Missing environment variable: "DEEPSEEK_API_KEY"');
    });

    it('should throw error if API key is the placeholder value', async () => {
        process.env.DEEPSEEK_API_KEY = 'your_deepseek_api_key_here'; // Set to placeholder
        const { generateContent } = await import('./ai');
        await expect(generateContent('test')).rejects.toThrow('Invalid/Missing environment variable: "DEEPSEEK_API_KEY"');
    });
});
