import { render } from 'vitest-browser-svelte';
import { describe, it, expect } from 'vitest';
import MindMap from './MindMap.svelte';

describe('MindMap component', () => {
    it('should render without errors', () => {
        const { container } = render(MindMap);
        expect(container).not.toBeNull();
        // We can add more specific assertions later
        expect(container.querySelector('.svelte-flow')).not.toBeNull();
    });
});
