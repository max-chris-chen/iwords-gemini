import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import NavBar from './NavBar.svelte';

describe('NavBar component', () => {
    it('should render the application name with bold typography', () => {
        const { container, unmount } = render(NavBar);
        const appName = container.querySelector('a');
        expect(appName?.textContent).toBe('iWords');
        expect(appName?.classList.contains('font-black')).toBe(true);
        expect(appName?.classList.contains('text-3xl')).toBe(true);
        unmount();
    });

    it('should have a vibrant background (gradient)', () => {
        const { container, unmount } = render(NavBar);
        const nav = container.querySelector('nav');
        expect(nav?.classList.contains('bg-gradient-to-r')).toBe(true);
        unmount();
    });

    it('should render a "Public Gallery" link', () => {
        const { container, unmount } = render(NavBar);
        const homeLink = container.querySelector('[data-testid="home-link"]');
        expect(homeLink).toBeInTheDocument();
        expect(homeLink?.textContent).toContain('Public Gallery');
        expect(homeLink?.getAttribute('href')).toBe('/');
        unmount();
    });

    it('should render Login link when no user', () => {
        const { getByText, unmount } = render(NavBar, { props: { user: null } });
        expect(getByText('Login')).toBeInTheDocument();
        unmount();
    });

    it('should render Dashboard and username when user is logged in', () => {
        const user = { id: '1', username: 'TestUser' };
        const { getByText, container, unmount } = render(NavBar, { props: { user } });
        expect(getByText('Dashboard')).toBeInTheDocument();
        expect(getByText('TestUser')).toBeInTheDocument();
        expect(getByText('Logout')).toBeInTheDocument();
        
        const loginLink = Array.from(container.querySelectorAll('a')).find(a => a.textContent === 'Login');
        expect(loginLink).toBeUndefined();
        
        unmount();
    });

    it('should render the capsule input', () => {
        const { container, unmount } = render(NavBar);
        const input = container.querySelector('input[placeholder="Create new scenario..."]');
        expect(input).toBeInTheDocument();
        unmount();
    });
});