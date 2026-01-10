import { json } from '@sveltejs/kit';
import { scenarioService } from '$lib/server/scenario';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
    const { id } = params;
    const user = locals.user;

    if (!id) {
        return json({ error: 'ID is required' }, { status: 400 });
    }

    if (!user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const scenario = await scenarioService.getById(id);
        if (!scenario) {
            return json({ error: 'Scenario not found' }, { status: 404 });
        }

        if (scenario.ownerId !== user.id) {
            return json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        if (body.isPublic !== undefined) {
            scenario.isPublic = body.isPublic;
        }

        const updated = await scenarioService.save(scenario);
        return json(updated);
    } catch (error) {
        console.error('Error updating scenario:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};

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
