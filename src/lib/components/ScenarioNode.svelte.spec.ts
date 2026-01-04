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
  }
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
});
