import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ScenarioCard from './ScenarioCard.svelte';

describe('ScenarioCard component', () => {
    const mockScenario = {
        _id: '123',
        prompt: 'At the Airport',
        createdAt: new Date('2026-01-01T10:00:00Z'),
        words: [{}, {}, {}] // 3 words
    };

    it('should render the scenario prompt', () => {
        const { getByText, unmount } = render(ScenarioCard, { scenario: mockScenario });
        expect(getByText('At the Airport')).toBeInTheDocument();
        unmount();
    });

    it('should display the word count', () => {
        const { getByText, unmount } = render(ScenarioCard, { scenario: mockScenario });
        expect(getByText(/3 words/)).toBeInTheDocument();
        unmount();
    });

    it('should display the formatted date', () => {
        const { getByText, unmount } = render(ScenarioCard, { scenario: mockScenario });
        // The exact format might depend on locale, but it should contain "2026"
        expect(getByText(/2026/)).toBeInTheDocument();
        unmount();
    });

    it('should trigger the open action', async () => {
        const { getByTestId, unmount } = render(ScenarioCard, { scenario: mockScenario });
        const openLink = getByTestId('open-scenario');
        expect(openLink.getAttribute('href')).toBe('/scenario/123');
        unmount();
    });

    it('should dispatch delete event when delete button is clicked', async () => {
        const deleteHandler = vi.fn();
        const { getByTestId, unmount } = render(ScenarioCard, { 
            scenario: mockScenario,
            ondelete: deleteHandler
        });
        const deleteButton = getByTestId('delete-scenario');
        
        // Mock confirm
        vi.spyOn(window, 'confirm').mockImplementation(() => true);

        await fireEvent.click(deleteButton);
        expect(deleteHandler).toHaveBeenCalled();
        unmount();
    });
});
