// src/routes/scenario/[id]/+page.server.ts
import { error } from '@sveltejs/kit';
import { scenarioService } from '$lib/server/scenario';
import { transformScenarioToFlowData } from '$lib/mindmap';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const scenario = await scenarioService.getById(params.id);

    if (!scenario) {
        throw error(404, 'Scenario not found');
    }

    const flowData = transformScenarioToFlowData(scenario);

    return {
        scenario,
        nodes: flowData.nodes,
        edges: flowData.edges,
    };
};
