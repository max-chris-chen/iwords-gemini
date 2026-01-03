import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scenarioService } from './scenario';
import * as ai from './ai';
import type { Scenario } from '../models/types';
import { ObjectId } from 'mongodb';

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
			
			// Mock save to return what it receives (plus an ID ideally, but minimal for this test)
			vi.spyOn(scenarioService, 'save').mockImplementation(async (s) => ({
				...s,
				_id: 'mock-id'
			}));

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
			const saveSpy = vi.spyOn(scenarioService, 'save').mockImplementation(async (s) => ({ ...s, _id: 'id' }));
			
			const result = await scenarioService.generate('test');

			expect(saveSpy).toHaveBeenCalledOnce();
			// result is the return value of save, so this check is circular but valid for flow verification
			// Better to check the arguments passed to save
			expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({
				prompt: 'test',
				words: expect.arrayContaining([expect.objectContaining({ word: 'test' })])
			}));
		});
	});

	describe('save', () => {
		it('should save a scenario to the database', async () => {
			const mockId = new ObjectId();
			const insertOneMock = vi.fn().mockImplementation(async (doc) => {
				doc._id = mockId; // Simulate MongoDB driver mutation
				return { acknowledged: true, insertedId: mockId };
			});
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
			expect(insertOneMock).toHaveBeenCalledWith(expect.objectContaining({ prompt: 'test' }));
			
			// Expect the returned object to be the Scenario with the new ID string
			expect(result._id).toBe(mockId.toHexString());
			expect(result.prompt).toBe('test');
		});
	});

	describe('getById', () => {
		it('should retrieve a scenario by its ID', async () => {
			const scenarioId = new ObjectId();
			const mockScenario = { _id: scenarioId, prompt: 'test', words: [] };
			
			const findOneMock = vi.fn().mockResolvedValue(mockScenario);
			const collectionMock = { findOne: findOneMock };
			const dbMock = { collection: vi.fn().mockReturnValue(collectionMock) };
			const clientMock = { db: vi.fn().mockReturnValue(dbMock) };

			vi.doMock('./db', () => ({
				default: Promise.resolve(clientMock)
			}));

			const { scenarioService: mockedService } = await import('./scenario');
			const result = await mockedService.getById(scenarioId.toHexString());

			expect(clientMock.db).toHaveBeenCalledWith('iwords');
			expect(dbMock.collection).toHaveBeenCalledWith('scenarios');
			expect(findOneMock).toHaveBeenCalledWith({ _id: scenarioId });
			expect(result).toEqual({
				...mockScenario,
				_id: scenarioId.toHexString()
			});
		});

		it('should return null if scenario is not found', async () => {
			const scenarioId = new ObjectId().toHexString();
			
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

	describe('getAll', () => {
		it('should retrieve all scenarios', async () => {
			const id1 = new ObjectId();
			const id2 = new ObjectId();
			const mockScenarios = [
				{ _id: id1, prompt: 'test1', words: [] },
				{ _id: id2, prompt: 'test2', words: [] },
			];
			
			const toArrayMock = vi.fn().mockResolvedValue(mockScenarios);
			const findMock = vi.fn().mockReturnValue({ toArray: toArrayMock });
			const collectionMock = { find: findMock };
			const dbMock = { collection: vi.fn().mockReturnValue(collectionMock) };
			const clientMock = { db: vi.fn().mockReturnValue(dbMock) };

			vi.doMock('./db', () => ({
				default: Promise.resolve(clientMock)
			}));

			const { scenarioService: mockedService } = await import('./scenario');
			const result = await mockedService.getAll();

			expect(clientMock.db).toHaveBeenCalledWith('iwords');
			expect(dbMock.collection).toHaveBeenCalledWith('scenarios');
			expect(findMock).toHaveBeenCalled();
			expect(result).toEqual([
				{ _id: id1.toHexString(), prompt: 'test1', words: [] },
				{ _id: id2.toHexString(), prompt: 'test2', words: [] }
			]);
		});
	});
});


