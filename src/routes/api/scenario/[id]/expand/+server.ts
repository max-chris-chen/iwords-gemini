import { json } from '@sveltejs/kit';
import { scenarioService } from '$lib/server/scenario';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request }) => {
    const { id } = params;

    if (!id) {
        return json({ error: 'ID is required' }, { status: 400 });
    }

    let targetWord: string | undefined;
    try {
        const body = await request.json();
        targetWord = body.targetWord;
    } catch (e) {
        // Body might be empty or not JSON, ignore
    }

    try {
        const scenario = await scenarioService.expand(id, targetWord);
        return json(scenario);
    } catch (error) {
        console.error('Error expanding scenario:', error);
        return json({ error: 'Failed to expand scenario' }, { status: 500 });
    }
};
