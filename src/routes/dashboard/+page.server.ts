import { redirect } from '@sveltejs/kit';
import { scenarioService } from '$lib/server/scenario';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    try {
        const scenarios = await scenarioService.list({ ownerId: locals.user.id });
        return {
            scenarios,
            user: locals.user
        };
    } catch (error) {
        console.error('Error loading dashboard:', error);
        throw error;
    }
};