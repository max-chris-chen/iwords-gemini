import { json } from '@sveltejs/kit';
import { scenarioService } from '$lib/server/scenario';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    try {
        const scenarios = await scenarioService.list({ isPublic: true });
        return json(scenarios);
    } catch (error) {
        console.error('Error fetching scenarios:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
