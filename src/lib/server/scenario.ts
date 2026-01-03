// src/lib/server/scenario.ts
import { ObjectId } from 'mongodb';
import type { Scenario, Word } from '../models/types';
import { generateContent } from './ai';
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
	const { _id, ...rest } = doc;
	return {
		...rest,
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
				audioUrl: w.audioUrl
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

async function getAll(): Promise<Scenario[]> {
	const client = await clientPromise;
	const db = client.db('iwords');
	const collection = db.collection<ScenarioDocument>('scenarios');
	const docs = await collection.find().toArray();
	return docs.map(toScenario);
}

export const scenarioService = {
	generate: generate,
	save: save,
	getById: getById,
	getAll: getAll
};