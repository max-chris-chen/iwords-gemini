import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateScenario } from './scenario'; // Only import what's needed for non-db tests
import * as ai from './ai';
import type { Scenario } from '../models/types';

vi.mock('./ai');

describe('Scenario Logic', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetModules(); // This is crucial to re-import modules with fresh mocks
	});

	describe('generateScenario', () => {
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

	describe('saveScenario', () => {
		it('should save a scenario to the database', async () => {
			const insertOneMock = vi.fn().mockResolvedValue({ acknowledged: true, insertedId: 'mock-id' });
			const collectionMock = { insertOne: insertOneMock };
			const dbMock = { collection: vi.fn().mockReturnValue(collectionMock) };
			const clientMock = { db: vi.fn().mockReturnValue(dbMock) };

			vi.doMock('./db', () => ({
				default: Promise.resolve(clientMock)
			}));

			// Dynamically import the module to get the version with the mock
			const { saveScenario } = await import('./scenario');

			const mockScenario: Scenario = {
				prompt: 'test',
				createdAt: new Date(),
				words: []
			};

			const result = await saveScenario(mockScenario);

			expect(clientMock.db).toHaveBeenCalledWith('iwords');
			expect(dbMock.collection).toHaveBeenCalledWith('scenarios');
			expect(insertOneMock).toHaveBeenCalledWith(mockScenario);
			expect(result).toEqual({ acknowledged: true, insertedId: 'mock-id' });
		});
	});
});
