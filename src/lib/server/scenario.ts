// src/lib/server/scenario.ts
import { ObjectId } from 'mongodb';
import type { Scenario, Word } from '../models/types';
import { generateContent, generateExpansion, generateRecursiveExpansion } from './ai';
import { validatePrompt, sanitizeScenarioData } from './security';
import clientPromise from './db';

// The type that is stored in MongoDB
type ScenarioDocument = Omit<Scenario, '_id'> & { _id?: ObjectId };

/**
 * Converts a MongoDB document to a serializable Scenario object.
 * @param doc The MongoDB document.
 * @returns A Scenario object with _id as a string.
 */
function toScenario(doc: ScenarioDocument): Scenario {
	const { _id, createdAt, ...rest } = doc;
	return {
		...rest,
		createdAt: new Date(createdAt),
		_id: _id?.toHexString()
	};
}

/**
 * Converts a Scenario object to a MongoDB document.
 * @param scenario The Scenario object.
 * @returns A ScenarioDocument object with _id as an ObjectId.
 */
function toScenarioDocument(scenario: Scenario): ScenarioDocument {
	const { _id, ...rest } = scenario;
	return {
		...rest,
		...(_id && { _id: new ObjectId(_id) })
	};
}

async function generate(prompt: string): Promise<Scenario> {
	validatePrompt(prompt);

	const aiPrompt = `
Generate a list of English words related to the scenario: "${prompt}".
Output strictly valid JSON with the following structure:
{
  "words": [
    {
      "word": "english word",
      "phonetics": "IPA",
      "definition": "english definition",
      "definition_cn": "中文意思",
      "examples": [
        { "en": "example sentence 1", "cn": "chinese translation" }
      ]
    }
  ]
}
Provide at least 5 words. Each word should have 2 examples.
`;

	const content = await generateContent(aiPrompt);

	try {
		// Clean up markdown code blocks if present
		const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
		const parsed = JSON.parse(cleanedContent);

		if (!parsed.words || !Array.isArray(parsed.words)) {
			throw new Error('Invalid JSON structure: missing words array');
		}

		const words: Word[] = parsed.words.map((w: any) =>
			sanitizeScenarioData({
				word: w.word,
				phonetics: w.phonetics,
				definition: w.definition,
				definition_cn: w.definition_cn,
				examples: w.examples || [],
				audioUrl: w.audioUrl,
				parentId: 'scenario'
			})
		);

		const scenario: Scenario = {
			prompt,
			createdAt: new Date(),
			words
		};

		const savedScenario = await scenarioService.save(scenario);

		return savedScenario;
	} catch (error) {
		console.error('Failed to parse AI response:', content);
		throw new Error('Failed to parse AI response: ' + (error as Error).message);
	}
}

async function save(scenario: Scenario): Promise<Scenario> {
	const client = await clientPromise;
	const db = client.db('iwords');
	const collection = db.collection<ScenarioDocument>('scenarios');
	
    // The mongo driver mutates the object, so we work on a copy
    const docToInsert = toScenarioDocument(scenario);
    
	await collection.insertOne(docToInsert);

	// After insertion, docToInsert._id is populated by the driver.
	return toScenario(docToInsert);
}

async function getById(id: string): Promise<Scenario | null> {
	const client = await clientPromise;
	const db = client.db('iwords');
	const collection = db.collection<ScenarioDocument>('scenarios');
	
    if (!ObjectId.isValid(id)) {
        return null;
    }

	const doc = await collection.findOne({ _id: new ObjectId(id) });
	if (!doc) {
		return null;
	}
	return toScenario(doc);
}

async function deleteById(id: string): Promise<boolean> {
	const client = await clientPromise;
	const db = client.db('iwords');
	const collection = db.collection<ScenarioDocument>('scenarios');
	
    if (!ObjectId.isValid(id)) {
        return false;
    }

	const result = await collection.deleteOne({ _id: new ObjectId(id) });
	return result.deletedCount === 1;
}

async function getAll(): Promise<Scenario[]> {
	const client = await clientPromise;
	const db = client.db('iwords');
	const collection = db.collection<ScenarioDocument>('scenarios');
	const docs = await collection.find().sort({ createdAt: -1 }).toArray();
	return docs.map(toScenario);
}

async function addWordsToScenario(id: string, newWords: Word[]): Promise<Scenario | null> {
	const client = await clientPromise;
	const db = client.db('iwords');
	const collection = db.collection<ScenarioDocument>('scenarios');

	if (!ObjectId.isValid(id)) {
		return null;
	}

	const result = await collection.updateOne(
		{ _id: new ObjectId(id) },
		{ $push: { words: { $each: newWords } } }
	);

	if (result.modifiedCount === 0) {
		return null;
	}

	return getById(id);
}

async function expand(id: string, targetWord?: string): Promise<Scenario> {
	const scenario = await getById(id);
	if (!scenario) {
		throw new Error(`Scenario not found: ${id}`);
	}

	const existingWords = scenario.words.map((w) => w.word);
	
	let content: string;
	if (targetWord) {
		content = await generateRecursiveExpansion(targetWord, scenario.prompt, existingWords);
	} else {
		content = await generateExpansion(scenario.prompt, existingWords);
	}

	try {
		const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
		const parsed = JSON.parse(cleanedContent);

		if (!parsed.words || !Array.isArray(parsed.words)) {
			throw new Error('Invalid JSON structure: missing words array');
		}

		const newWords: Word[] = parsed.words.map((w: any) =>
			sanitizeScenarioData({
				word: w.word,
				phonetics: w.phonetics,
				definition: w.definition,
				definition_cn: w.definition_cn,
				examples: w.examples || [],
				audioUrl: w.audioUrl,
				parentId: targetWord || 'scenario'
			})
		);

		const updatedScenario = await addWordsToScenario(id, newWords);
		if (!updatedScenario) {
			throw new Error('Failed to update scenario with new words');
		}

		return updatedScenario;
	} catch (error) {
		console.error('Failed to parse expansion AI response:', content);
		throw new Error('Failed to parse AI response: ' + (error as Error).message);
	}
}

export const scenarioService = {

	generate: generate,

	save: save,

	getById: getById,

	getAll: getAll,

	deleteById: deleteById,

	expand: expand,

	addWordsToScenario: addWordsToScenario

};
