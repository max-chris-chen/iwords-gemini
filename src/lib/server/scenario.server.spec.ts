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
			const mockDate = new Date();
			const mockScenario = { _id: scenarioId, prompt: 'test', words: [], createdAt: mockDate };
			
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
				_id: scenarioId.toHexString(),
				createdAt: mockDate
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
			const mockDate = new Date();
			const mockScenarios = [
				{ _id: id1, prompt: 'test1', words: [], createdAt: mockDate },
				{ _id: id2, prompt: 'test2', words: [], createdAt: mockDate },
			];
			
			const toArrayMock = vi.fn().mockResolvedValue(mockScenarios);
			const sortMock = vi.fn().mockReturnValue({ toArray: toArrayMock });
			const findMock = vi.fn().mockReturnValue({ sort: sortMock });
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
				{ _id: id1.toHexString(), prompt: 'test1', words: [], createdAt: mockDate },
				{ _id: id2.toHexString(), prompt: 'test2', words: [], createdAt: mockDate }
			]);
		});
	});

	describe('deleteById', () => {
		it('should delete a scenario by ID', async () => {
			const scenarioId = new ObjectId();
			const deleteOneMock = vi.fn().mockResolvedValue({ deletedCount: 1 });
			const collectionMock = { deleteOne: deleteOneMock };
			const dbMock = { collection: vi.fn().mockReturnValue(collectionMock) };
			const clientMock = { db: vi.fn().mockReturnValue(dbMock) };

			vi.doMock('./db', () => ({
				default: Promise.resolve(clientMock)
			}));

			const { scenarioService: mockedService } = await import('./scenario');
			const result = await mockedService.deleteById(scenarioId.toHexString());

			expect(deleteOneMock).toHaveBeenCalledWith({ _id: scenarioId });
			expect(result).toBe(true);
		});

		it('should return false if ID is invalid', async () => {
			const { scenarioService } = await import('./scenario');
			const result = await scenarioService.deleteById('invalid-id');
			expect(result).toBe(false);
		});
	});

	describe('expand', () => {
		it('should add new words to an existing scenario using AI', async () => {
			const scenarioId = new ObjectId();
			const mockDate = new Date();
			const mockScenario = {
				_id: scenarioId,
				prompt: 'coding',
				words: [{ word: 'variable', examples: [], phonetics: '', definition: '', definition_cn: '' }],
				createdAt: mockDate
			};

			const findOneMock = vi.fn()
				.mockResolvedValueOnce(mockScenario)
				.mockResolvedValueOnce({
					...mockScenario,
					words: [...mockScenario.words,
						{ word: 'function', examples: [], phonetics: '', definition: '', definition_cn: '' },
						{ word: 'class', examples: [], phonetics: '', definition: '', definition_cn: '' }
					]
				});
			const updateOneMock = vi.fn().mockResolvedValue({ modifiedCount: 1 });
			const collectionMock = { findOne: findOneMock, updateOne: updateOneMock };
			const dbMock = { collection: vi.fn().mockReturnValue(collectionMock) };
			const clientMock = { db: vi.fn().mockReturnValue(dbMock) };

			vi.doMock('./db', () => ({
				default: Promise.resolve(clientMock)
			}));

			const mockAiResponse = JSON.stringify({
				words: [
					{ word: 'function', examples: [], phonetics: '', definition: '', definition_cn: '' },
					{ word: 'class', examples: [], phonetics: '', definition: '', definition_cn: '' }
				]
			});
			(ai.generateExpansion as any).mockResolvedValue(mockAiResponse);

			const { scenarioService: mockedService } = await import('./scenario');
			const result = await mockedService.expand(scenarioId.toHexString());

			expect(findOneMock).toHaveBeenCalled();
			expect(ai.generateExpansion).toHaveBeenCalledWith('coding', ['variable']);
			expect(updateOneMock).toHaveBeenCalled();
			expect(result.words).toHaveLength(3);
		});

		it('should add new words recursively if targetWord is provided', async () => {
			const scenarioId = new ObjectId();
			const mockDate = new Date();
			const mockScenario = {
				_id: scenarioId,
				prompt: 'coding',
				words: [{ word: 'variable', examples: [], phonetics: '', definition: '', definition_cn: '' }],
				createdAt: mockDate
			};

			const findOneMock = vi.fn()
				.mockResolvedValueOnce(mockScenario)
				.mockResolvedValueOnce({
					...mockScenario,
					words: [...mockScenario.words,
						{ word: 'integer', examples: [], phonetics: '', definition: '', definition_cn: '' },
						{ word: 'float', examples: [], phonetics: '', definition: '', definition_cn: '' }
					]
				});
			const updateOneMock = vi.fn().mockResolvedValue({ modifiedCount: 1 });
			const collectionMock = { findOne: findOneMock, updateOne: updateOneMock };
			const dbMock = { collection: vi.fn().mockReturnValue(collectionMock) };
			const clientMock = { db: vi.fn().mockReturnValue(dbMock) };

			vi.doMock('./db', () => ({
				default: Promise.resolve(clientMock)
			}));

			const mockAiResponse = JSON.stringify({
				words: [
					{ word: 'integer', examples: [], phonetics: '', definition: '', definition_cn: '' },
					{ word: 'float', examples: [], phonetics: '', definition: '', definition_cn: '' }
				]
			});
			(ai.generateRecursiveExpansion as any).mockResolvedValue(mockAiResponse);

			const { scenarioService: mockedService } = await import('./scenario');
			const result = await mockedService.expand(scenarioId.toHexString(), 'variable');

			expect(findOneMock).toHaveBeenCalled();
			expect(ai.generateRecursiveExpansion).toHaveBeenCalledWith('variable', 'coding', ['variable']);
			expect(updateOneMock).toHaveBeenCalled();
			expect(result.words).toHaveLength(3);
			// Verify parentId would be handled (though this test mocks the service internals mostly, 
			// the integration logic relies on sanitizeScenarioData which we just fixed)
		});

		it('should throw error if scenario not found', async () => {
			const scenarioId = new ObjectId().toHexString();
			const findOneMock = vi.fn().mockResolvedValue(null);
			const collectionMock = { findOne: findOneMock };
			const dbMock = { collection: vi.fn().mockReturnValue(collectionMock) };
			const clientMock = { db: vi.fn().mockReturnValue(dbMock) };

			vi.doMock('./db', () => ({
				default: Promise.resolve(clientMock)
			}));

			const { scenarioService: mockedService } = await import('./scenario');
			await expect(mockedService.expand(scenarioId)).rejects.toThrow('Scenario not found');
		});

		it('should throw error if AI response is invalid', async () => {
			const scenarioId = new ObjectId();
			const mockScenario = { _id: scenarioId, prompt: 'test', words: [], createdAt: new Date() };
			const findOneMock = vi.fn().mockResolvedValue(mockScenario);
			const collectionMock = { findOne: findOneMock };
			const dbMock = { collection: vi.fn().mockReturnValue(collectionMock) };
			const clientMock = { db: vi.fn().mockReturnValue(dbMock) };

			vi.doMock('./db', () => ({
				default: Promise.resolve(clientMock)
			}));

			(ai.generateExpansion as any).mockResolvedValue('invalid json');

			const { scenarioService: mockedService } = await import('./scenario');
			await expect(mockedService.expand(scenarioId.toHexString())).rejects.toThrow('Failed to parse AI response');
		});
	});

	describe('addWordsToScenario', () => {
		it('should append words to a scenario in the database', async () => {
			const scenarioId = new ObjectId();
			const updateOneMock = vi.fn().mockResolvedValue({ modifiedCount: 1 });
			const findOneMock = vi.fn().mockResolvedValue({ _id: scenarioId, prompt: 'test', words: [], createdAt: new Date() });
			const collectionMock = { updateOne: updateOneMock, findOne: findOneMock };
			const dbMock = { collection: vi.fn().mockReturnValue(collectionMock) };
			const clientMock = { db: vi.fn().mockReturnValue(dbMock) };

			vi.doMock('./db', () => ({
				default: Promise.resolve(clientMock)
			}));

			const { scenarioService: mockedService } = await import('./scenario');

			const newWords = [{ word: 'new', examples: [], phonetics: '', definition: '', definition_cn: '' }];
			await mockedService.addWordsToScenario(scenarioId.toHexString(), newWords);

			expect(updateOneMock).toHaveBeenCalledWith(
				{ _id: scenarioId },
				{ $push: { words: { $each: newWords } } }
			);
		});
	});
});


