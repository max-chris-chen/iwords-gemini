import { scenarioService } from '$lib/server/scenario';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        const scenarios = await scenarioService.list({ isPublic: true });
        return {
            scenarios,
        };
    } catch (error) {
        console.error('CRITICAL ERROR in homepage load:', error);
        throw error;
    }
};