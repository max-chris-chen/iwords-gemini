import { json } from '@sveltejs/kit';
import { scenarioService } from '$lib/server/scenario';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params }) => {
    const { id } = params;

    if (!id) {
        return json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        const scenario = await scenarioService.expand(id);
        return json(scenario);
    } catch (error) {
        console.error('Error expanding scenario:', error);
        return json({ error: 'Failed to expand scenario' }, { status: 500 });
    }
};
