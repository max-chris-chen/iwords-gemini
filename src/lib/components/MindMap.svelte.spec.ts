import { render } from 'vitest-browser-svelte';
import { describe, it, expect } from 'vitest';
import MindMap from './MindMap.svelte';

describe('MindMap component', () => {
    it('should render without errors', () => {
        const { container } = render(MindMap, { props: { nodes: [], edges: [] } });
        expect(container).not.toBeNull();
        expect(container.querySelector('.svelte-flow')).not.toBeNull();
    });

    it('should render ScenarioNode when type is scenario', async () => {
        const nodes = [
            {
                id: '1',
                type: 'scenario',
                data: { label: 'Test Scenario' },
                position: { x: 0, y: 0 }
            }
        ];
        const { getByText, container } = render(MindMap, { props: { nodes, edges: [] } });
        
        const scenarioLabel = getByText('Test Scenario');
        expect(scenarioLabel).toBeInTheDocument();
        
        // Verify it is using ScenarioNode by checking for its specific class
        // Note: Svelte Flow might handle classes differently, but the component's div should be there.
        // We look for the div with 'bg-amber-100/30'
        const scenarioNode = container.querySelector('.bg-amber-100\\/30'); 
        // Escape slash in selector if needed, or use classList check on found element
        expect(scenarioNode).not.toBeNull();
    });
});
