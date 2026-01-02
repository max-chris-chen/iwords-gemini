// src/routes/+page.server.ts
import { scenarioService } from '$lib/server/scenario';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const scenarios = await scenarioService.getAll();
    return {
        scenarios,
    };
};
