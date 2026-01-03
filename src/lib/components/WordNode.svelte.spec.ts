
import { render, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach, vi } from 'vitest';
import WordNode from './WordNode.svelte';

// Mock @xyflow/svelte
vi.mock('@xyflow/svelte', () => ({
  Handle: vi.fn(),
  Position: {
    Top: 'top',
    Bottom: 'bottom',
    Left: 'left',
    Right: 'right'
  }
}));

describe('WordNode component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render the word and an audio button', () => {
    const nodeData = {
      data: {
        label: 'Test Word',
        word: {
          word: 'Test Word',
        },
      },
    };

    const { getByText, getByRole } = render(WordNode, { props: { data: nodeData.data } });

    expect(getByText('Test Word')).toBeInTheDocument();
    const button = getByRole('button', { name: /play audio/i });
    expect(button).toBeInTheDocument();
  });
});
