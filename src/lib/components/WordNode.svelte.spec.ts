
import { render, cleanup, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, afterEach, vi } from 'vitest';
import WordNode from './WordNode.svelte';
import { audioManager } from '$lib/audio';

// Mock audioManager
vi.mock('$lib/audio', () => ({
  audioManager: {
    speak: vi.fn()
  }
}));

// Mock @xyflow/svelte
vi.mock('@xyflow/svelte', () => ({
  Handle: vi.fn(),
  Position: {
    Top: 'top',
    Bottom: 'bottom',
    Left: 'left',
    Right: 'right'
  },
  useSvelteFlow: () => ({
    setNodes: vi.fn(),
    setEdges: vi.fn()
  })
}));

describe('WordNode component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
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

  it('should call speak when audio button is clicked', async () => {
    const nodeData = {
      data: {
        word: {
          word: 'hello',
        },
      },
    };

    const { getByRole } = render(WordNode, { props: { data: nodeData.data } });
    const button = getByRole('button', { name: /play audio/i });
    
    await fireEvent.click(button);
    expect(audioManager.speak).toHaveBeenCalledWith('hello');
  });

  it('should have glassmorphism styling', () => {
    const nodeData = {
      data: {
        label: 'Test Word',
        word: {
          word: 'Test Word',
        },
      },
    };

    const { container } = render(WordNode, { props: { data: nodeData.data } });
    
    // Check for glassmorphism classes
    // We expect the main container to have these classes
    const nodeDiv = container.querySelector('div.backdrop-blur-md');
    expect(nodeDiv).toBeInTheDocument();
  });

  it('should render an expansion button and show loading state', async () => {
    const nodeData = {
      data: {
        word: { word: 'test' },
        onExpand: vi.fn(),
        isExpanding: true
      },
    };

    const { getByRole } = render(WordNode, { props: { data: nodeData.data } });
    const expandButton = getByRole('button', { name: /expand word/i });
    expect(expandButton).toBeInTheDocument();
    
    // Check for loading state (spinner div)
    const spinner = expandButton.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
