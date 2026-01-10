import { migrateLegacyScenarios } from '../src/lib/server/migrations';

async function main() {
    console.log('Starting migration of legacy scenarios...');
    try {
        const result = await migrateLegacyScenarios();
        console.log(`Migration complete.`);
        console.log(`Matched: ${result.matchedCount}`);
        console.log(`Modified: ${result.modifiedCount}`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

main();
