import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
    it('should render a list of scenarios', () => {
        const mockData = {
            scenarios: [
                { _id: '1', prompt: 'Scenario 1', createdAt: new Date() },
                { _id: '2', prompt: 'Scenario 2', createdAt: new Date() },
            ],
        };

        const { container } = render(Page, { props: { data: mockData } });

        const links = container.querySelectorAll('a');
        expect(links).toHaveLength(2);
        expect(links[0].textContent).toBe('Scenario 1');
        expect(links[0].getAttribute('href')).toBe('/scenario/1');
        expect(links[1].textContent).toBe('Scenario 2');
        expect(links[1].getAttribute('href')).toBe('/scenario/2');
    });

    it('should render a message if no scenarios are found', () => {
        const mockData = {
            scenarios: [],
        };

        const { container } = render(Page, { props: { data: mockData } });

        expect(container.querySelector('p')?.textContent).toBe('No scenarios found. Generate one!');
    });
});
