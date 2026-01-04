import { render, cleanup, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, afterEach, vi } from 'vitest';
import ExampleNode from './ExampleNode.svelte';
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

describe('ExampleNode component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render the example text', () => {
    const nodeData = {
      data: {
        example: {
          en: 'This is an example.',
          cn: '这是一个例子。'
        },
      },
    };

    const { getByText } = render(ExampleNode, { props: { data: nodeData.data } });

    expect(getByText('This is an example.')).toBeInTheDocument();
    expect(getByText('这是一个例子。')).toBeInTheDocument();
  });

  it('should call speak when audio button is clicked', async () => {
    const nodeData = {
      data: {
        example: {
          en: 'Hello world',
        },
      },
    };

    const { getByRole } = render(ExampleNode, { props: { data: nodeData.data } });
    const button = getByRole('button', { name: /play audio/i });
    
    await fireEvent.click(button);
    expect(audioManager.speak).toHaveBeenCalledWith('Hello world');
  });

  it('should have glassmorphism styling', () => {
    const nodeData = {
      data: {
        example: {
          en: 'This is an example.',
        },
      },
    };

    const { container } = render(ExampleNode, { props: { data: nodeData.data } });
    
    // Check for glassmorphism classes
    const nodeDiv = container.querySelector('div.backdrop-blur-md');
    expect(nodeDiv).toBeInTheDocument();
  });
});
