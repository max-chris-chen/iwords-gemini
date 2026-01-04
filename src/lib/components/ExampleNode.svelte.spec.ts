import { render, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach, vi } from 'vitest';
import ExampleNode from './ExampleNode.svelte';

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

describe('ExampleNode component', () => {
  afterEach(() => {
    cleanup();
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
