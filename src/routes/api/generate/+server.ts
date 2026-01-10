import { json } from '@sveltejs/kit';
import { scenarioService } from '$lib/server/scenario';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const { prompt } = await request.json();

        if (!prompt || typeof prompt !== 'string') {
            return json({ error: 'Invalid prompt provided' }, { status: 400 });
        }

        const scenario = await scenarioService.generate(prompt, locals.user?.id);
        return json(scenario, { status: 201 });
    } catch (error: any) {
        console.error('API Error:', error);
        return json({ error: 'Failed to generate scenario', details: error.message }, { status: 500 });
    }
};
