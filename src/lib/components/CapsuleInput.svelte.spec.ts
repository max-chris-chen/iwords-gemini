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
});
