import { render, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach, vi } from 'vitest';
import ScenarioNode from './ScenarioNode.svelte';

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

describe('ScenarioNode component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render the scenario label', () => {
    const nodeData = {
      data: {
        label: 'My Scenario',
      },
    };

    const { getByText } = render(ScenarioNode, { props: { data: nodeData.data } });

    expect(getByText('My Scenario')).toBeInTheDocument();
  });

  it('should have glassmorphism and circular/pill styling classes', () => {
    const nodeData = {
      data: {
        label: 'My Scenario',
      },
    };

    const { container } = render(ScenarioNode, { props: { data: nodeData.data } });
    
    // Check for glassmorphism classes (backdrop-blur, etc.) and shape (rounded-full)
    // We expect specific Tailwind classes as per the spec requirements
    const nodeDiv = container.querySelector('div.backdrop-blur-md');
    expect(nodeDiv).toBeInTheDocument();
    expect(nodeDiv).toHaveClass('rounded-full');
    expect(nodeDiv).toHaveClass('bg-amber-100/30'); // Example distinct color
    expect(nodeDiv).toHaveClass('border-amber-200/50');
  });

  it('should render the expansion button and handle click', async () => {
    const onExpand = vi.fn();
    const { getByRole } = render(ScenarioNode, { 
      props: { 
        data: { label: 'Test', onExpand } 
      } 
    });

    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    
    await button.click();
    expect(onExpand).toHaveBeenCalled();
  });

  it('should show loading indicator when expanding', () => {
    const { getByTestId } = render(ScenarioNode, { 
      props: { 
        data: { label: 'Test', isExpanding: true } 
      } 
    });

    expect(getByTestId('loading-indicator')).toBeInTheDocument();
  });
});
