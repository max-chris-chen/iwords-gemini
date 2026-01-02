import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scenarioService } from './scenario';
import * as ai from './ai';
import type { Scenario } from '../models/types';

vi.mock('./ai');

describe('Scenario Logic', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetModules(); // This is crucial to re-import modules with fresh mocks
	});

	describe('generate', () => {
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
			
			// Since we refactored, let's spy on the save method to avoid actual DB calls
			vi.spyOn(scenarioService, 'save').mockResolvedValue({} as any);

			const prompt = 'fruit';
			const result = await scenarioService.generate(prompt);

			expect(ai.generateContent).toHaveBeenCalledWith(expect.stringContaining('fruit'));
			expect(ai.generateContent).toHaveBeenCalledWith(expect.stringContaining('JSON'));
			expect(result.prompt).toBe('fruit');
			expect(result.words).toHaveLength(1);
			expect(result.words[0].word).toBe('apple');
		});

		it('should handle invalid JSON from AI', async () => {
			(ai.generateContent as any).mockResolvedValue('Not JSON');
			await expect(scenarioService.generate('test')).rejects.toThrow();
		});

		it('should save the generated scenario', async () => {
			const mockAiResponse = JSON.stringify({ words: [{ word: 'test' }] });
			(ai.generateContent as any).mockResolvedValue(mockAiResponse);
			const saveSpy = vi.spyOn(scenarioService, 'save').mockResolvedValue({} as any);
			
			const result = await scenarioService.generate('test');

			expect(saveSpy).toHaveBeenCalledOnce();
			expect(saveSpy).toHaveBeenCalledWith(result);
		});
	});

	describe('save', () => {
		it('should save a scenario to the database', async () => {
			const insertOneMock = vi.fn().mockResolvedValue({ acknowledged: true, insertedId: 'mock-id' });
			const collectionMock = { insertOne: insertOneMock };
			const dbMock = { collection: vi.fn().mockReturnValue(collectionMock) };
			const clientMock = { db: vi.fn().mockReturnValue(dbMock) };

			vi.doMock('./db', () => ({
				default: Promise.resolve(clientMock)
			}));
			
			// Re-import the service to get the version with the mocked 'db'
			const { scenarioService: mockedService } = await import('./scenario');

			const mockScenario: Scenario = {
				prompt: 'test',
				createdAt: new Date(),
				words: []
			};

			const result = await mockedService.save(mockScenario);

			expect(clientMock.db).toHaveBeenCalledWith('iwords');
			expect(dbMock.collection).toHaveBeenCalledWith('scenarios');
			expect(insertOneMock).toHaveBeenCalledWith(mockScenario);
			expect(result).toEqual({ acknowledged: true, insertedId: 'mock-id' });
		});
	});	describe('getById', () => {
		it('should retrieve a scenario by its ID', async () => {
			const scenarioId = '60d0fe4f5311236168a109ca';
			const mockScenario = { _id: scenarioId, prompt: 'test', words: [] };
			
			const findOneMock = vi.fn().mockResolvedValue(mockScenario);
			const collectionMock = { findOne: findOneMock };
			const dbMock = { collection: vi.fn().mockReturnValue(collectionMock) };
			const clientMock = { db: vi.fn().mockReturnValue(dbMock) };

			vi.doMock('./db', () => ({
				default: Promise.resolve(clientMock)
			}));

			const { scenarioService: mockedService } = await import('./scenario');
			const result = await mockedService.getById(scenarioId);

			expect(clientMock.db).toHaveBeenCalledWith('iwords');
			expect(dbMock.collection).toHaveBeenCalledWith('scenarios');
			expect(findOneMock).toHaveBeenCalledWith({ _id: new (await import('mongodb')).ObjectId(scenarioId) });
			expect(result).toEqual(mockScenario);
		});

		it('should return null if scenario is not found', async () => {
			const scenarioId = '60d0fe4f5311236168a109cb';
			
			const findOneMock = vi.fn().mockResolvedValue(null);
			const collectionMock = { findOne: findOneMock };
			const dbMock = { collection: vi.fn().mockReturnValue(collectionMock) };
			const clientMock = { db: vi.fn().mockReturnValue(dbMock) };

			vi.doMock('./db', () => ({
				default: Promise.resolve(clientMock)
			}));

			const { scenarioService: mockedService } = await import('./scenario');
			const result = await mockedService.getById(scenarioId);

			expect(result).toBeNull();
		});
	});
});

