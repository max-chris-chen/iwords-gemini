import clientPromise from './db';

export async function migrateLegacyScenarios() {
    const client = await clientPromise;
    const db = client.db('iwords');
    const collection = db.collection('scenarios');

    const result = await collection.updateMany(
        { ownerId: { $exists: false } },
        { $set: { isPublic: true } }
    );

    return {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
    };
}