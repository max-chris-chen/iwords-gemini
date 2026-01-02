import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import NavBar from './NavBar.svelte';

describe('NavBar component', () => {
    it('should render the application name', () => {
        const { container, unmount } = render(NavBar);
        const appName = container.querySelector('a');
        expect(appName?.textContent).toBe('iWords');
        unmount();
    });

    it('should render a "Home" link', () => {
        const { container, unmount } = render(NavBar);
        const homeLink = container.querySelector('[data-testid="home-link"]');
        expect(homeLink).toBeInTheDocument();
        expect(homeLink?.getAttribute('href')).toBe('/');
        unmount();
    });
});