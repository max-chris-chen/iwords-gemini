// src/routes/+page.server.ts
import { scenarioService } from '$lib/server/scenario';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    console.log('Homepage load function started.');
    try {
        console.log('Calling scenarioService.getAll()...');
        const scenarios = await scenarioService.getAll();
        console.log(`scenarioService.getAll() returned ${scenarios.length} scenarios.`);
        return {
            scenarios,
        };
    } catch (error) {
        console.error('CRITICAL ERROR in homepage load:', error);
        // Re-throw the error to ensure a 500 is returned
        throw error;
    }
};
