import { render, cleanup, screen } from '@testing-library/svelte';
import { describe, it, expect, afterEach } from 'vitest';
import CapsuleInput from './CapsuleInput.svelte';

describe('CapsuleInput component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render the input field with placeholder', () => {
    render(CapsuleInput, { props: { placeholder: 'Enter scenario...' } });
    const input = screen.getByPlaceholderText('Enter scenario...');
    expect(input).toBeInTheDocument();
  });

  it('should render the submission icon', () => {
    render(CapsuleInput);
    const button = screen.getByRole('button', { name: /create scenario/i });
    expect(button).toBeInTheDocument();
  });

  it('should have a pill-shaped container', () => {
    const { container } = render(CapsuleInput);
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass('rounded-full');
  });

  it('should expand on focus and collapse on blur if empty', async () => {
    const { container } = render(CapsuleInput);
    const wrapper = container.firstElementChild;
    const input = screen.getByRole('textbox'); // Use getByRole for input type="text"

    // Initial state: compact
    expect(wrapper).toHaveClass('w-32');

    // Focus: expand
    await input.focus();
    expect(wrapper).toHaveClass('w-64'); // Assuming w-64 for expanded state

    // Blur (empty): collapse
    await input.blur();
    expect(wrapper).toHaveClass('w-32');
  });

  it('should remain expanded on blur if not empty', async () => {
    // Spec: "On Blur: If the input is empty, animate back to the compact width."
    // Implication: If not empty, it might stay expanded.
    
    // However, for this specific requirement, let's just ensure it DOES collapse if empty, 
    // and let's assume for now it ALSO collapses if not empty UNLESS the spec explicitly forbids it?
    // "If the input is empty, animate back..." -> strictly implies a condition.
    // If I type something, and click away, does it stay big?
    // Let's implement: Only collapse if empty.
    
    const { container } = render(CapsuleInput);
    const wrapper = container.firstElementChild;
    const input = screen.getByRole('textbox');

    await input.focus();
    expect(wrapper).toHaveClass('w-64');

    // Type something
    input.value = 'My Scenario'; 
    // Note: Svelte binding might need an event to trigger update if binding is used, 
    // but here we are checking the class logic which probably depends on the value.
    // We'll use userEvent or fireEvent to type properly if needed, 
    // but setting value directly might not trigger Svelte reactivity.
    
    // Let's use fireEvent to simulate input
    const { fireEvent } = await import('@testing-library/svelte');
    await fireEvent.input(input, { target: { value: 'My Scenario' } });

    await input.blur();
    // It should stay expanded? 
    // Based on "If the input is empty, animate back", the converse is "If not empty, do not animate back".
    expect(wrapper).toHaveClass('w-64');
  });
});
