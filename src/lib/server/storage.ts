import type { Scenario } from '../models/types';
import clientPromise from './db';

export async function saveScenario(scenario: Scenario): Promise<string> {
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('scenarios').insertOne(scenario);
    return result.insertedId.toString();
}
