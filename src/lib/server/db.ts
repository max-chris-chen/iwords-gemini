import { MongoClient } from 'mongodb';
import { MONGO_URI } from '$env/static/private';

if (!MONGO_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
}

const client = new MongoClient(MONGO_URI);
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    clientPromise = client.connect();
}

export default clientPromise;
