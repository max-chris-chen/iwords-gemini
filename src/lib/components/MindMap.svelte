<script lang="ts">
  import { SvelteFlow, Controls, Background } from '@xyflow/svelte';
  import type { Node, Edge } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';
  import WordNode from './WordNode.svelte';
  import ExampleNode from './ExampleNode.svelte';
  import ScenarioNode from './ScenarioNode.svelte';

  const { nodes: initialNodes, edges: initialEdges }: { nodes: Node[], edges: Edge[] } = $props();

  let nodes = $state(initialNodes);
  let edges = $state(initialEdges);

  const nodeTypes = {
    word: WordNode,
    example: ExampleNode,
    scenario: ScenarioNode,
  };

  const defaultEdgeOptions = {
    type: 'default',
    animated: true,
    style: 'stroke: #94a3b8; stroke-width: 2;',
  };

  function onNodeClick({ event, node }: { event: MouseEvent | TouchEvent, node: Node }) {
    const target = event.target as HTMLElement;
    if (node.type !== 'word' || !target.closest('.toggle-examples-btn')) return;

    // Toggle logic
    const wordId = node.id;
    
    // Find child node IDs based on edges
    const childNodeIds = edges
        .filter(e => e.source === wordId)
        .map(e => e.target);

    // Update edges
    edges = edges.map(e => {
        if (e.source === wordId) {
            return { ...e, hidden: !e.hidden };
        }
        return e;
    });

    // Update nodes
    nodes = nodes.map(n => {
        if (childNodeIds.includes(n.id)) {
            return { ...n, hidden: !n.hidden };
        }
        return n;
    });
  }
</script>

<div class="mindmap-container h-full w-full bg-linear-to-br from-slate-50 to-blue-100/50">
  <SvelteFlow 
    bind:nodes
    bind:edges
    {nodeTypes} 
    {defaultEdgeOptions}
    onnodeclick={onNodeClick}
  >
    <Controls />
  </SvelteFlow>
</div>

<style>
  .mindmap-container {
    background-attachment: fixed;
  }
</style>