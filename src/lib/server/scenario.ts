import type { Scenario, Word } from '../models/types';
import { generateContent } from './ai';
import { validatePrompt, sanitizeScenarioData } from './security';
import clientPromise from './db';

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
      "examples": [
        { "en": "example sentence 1", "cn": "chinese translation" }
      ]
    }
  ]
}
Provide at least 5 words. Each word should have 5 examples.
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
				examples: w.examples || [],
				audioUrl: w.audioUrl
			})
		);

		const scenario: Scenario = {
			prompt,
			createdAt: new Date(),
			words
		};

		await scenarioService.save(scenario);

		return scenario;
	} catch (error) {
		console.error('Failed to parse AI response:', content);
		throw new Error('Failed to parse AI response: ' + (error as Error).message);
	}
}

async function save(scenario: Scenario) {
	const client = await clientPromise;
	const db = client.db('iwords');
	const collection = db.collection<Scenario>('scenarios');
	const result = await collection.insertOne(scenario);
	return result;
}

import { ObjectId } from 'mongodb';

// ... (existing code)

async function getById(id: string) {
	const client = await clientPromise;
	const db = client.db('iwords');
	const collection = db.collection<Scenario>('scenarios');
	const scenario = await collection.findOne({ _id: new ObjectId(id) });
	return scenario;
}

export const scenarioService = {
	generate: generate,
	save: save,
	getById: getById
};
