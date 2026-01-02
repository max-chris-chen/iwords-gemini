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
});
