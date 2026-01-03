import { json } from '@sveltejs/kit';
import { scenarioService } from '$lib/server/scenario';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params }) => {
    const { id } = params;

    if (!id) {
        return json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        const success = await scenarioService.deleteById(id);
        if (success) {
            return json({ success: true });
        } else {
            return json({ error: 'Scenario not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error deleting scenario:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
