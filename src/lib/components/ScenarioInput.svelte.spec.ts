import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ScenarioInput from './ScenarioInput.svelte';

describe('ScenarioInput component', () => {
    it('should render a prominent text area input', () => {
        const { getByRole } = render(ScenarioInput);
        const textarea = getByRole('textbox');
        expect(textarea).toBeInTheDocument();
        expect(textarea).toHaveClass('w-full'); // Assuming prominent means wide
    });

    it('should render a submit button', () => {
        const { getByRole } = render(ScenarioInput);
        const button = getByRole('button', { name: 'Generate Scenario' });
        expect(button).toBeInTheDocument();
    });

    it('should disable inputs and show loading state when isLoading is true', () => {
        const { getByRole } = render(ScenarioInput, { isLoading: true });
        
        const button = getByRole('button', { name: 'Generating...' });
        const textarea = getByRole('textbox');
        
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
        expect(textarea).toBeDisabled();
    });
});
