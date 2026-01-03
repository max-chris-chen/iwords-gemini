import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
    it('should render a list of scenarios', () => {
        const mockData = {
            scenarios: [
                { _id: '1', prompt: 'Scenario 1', createdAt: new Date(), words: [] },
                { _id: '2', prompt: 'Scenario 2', createdAt: new Date(), words: [] },
            ],
        };

        const { container } = render(Page, { props: { data: mockData } });

        const cards = container.querySelectorAll('[data-testid="open-scenario"]');
        expect(cards).toHaveLength(2);
        expect(cards[0].getAttribute('href')).toBe('/scenario/1');
        expect(cards[1].getAttribute('href')).toBe('/scenario/2');
        
        expect(container.textContent).toContain('Scenario 1');
        expect(container.textContent).toContain('Scenario 2');
    });

    it('should render a message if no scenarios are found', () => {
        const mockData = {
            scenarios: [],
        };

        const { container } = render(Page, { props: { data: mockData } });

        expect(container.textContent).toContain('No scenarios yet');
    });
});
