// src/routes/scenario/[id]/page.svelte.spec.ts
import { render } from 'vitest-browser-svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

describe('Scenario page', () => {
    it('should render the mind map', () => {
        const mockData = {
            scenario: { prompt: 'Test' },
            nodes: [{ id: '1', position: { x: 0, y: 0 }, data: { label: 'Test Node' } }],
            edges: [],
        };
        
        const { container } = render(Page, { props: { data: mockData } });

        expect(container.querySelector('h1')?.textContent).toBe('Mind Map for "Test"');
        expect(container.querySelector('.svelte-flow')).not.toBeNull();
    });
});
