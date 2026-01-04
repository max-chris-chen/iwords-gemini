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
    type: 'smoothstep',
    animated: true,
    style: 'stroke: #94a3b8; stroke-width: 2; stroke-dasharray: 5 5;',
  };
</script>

<div class="mindmap-container h-full w-full bg-linear-to-br from-slate-50 to-blue-100/50">
  <SvelteFlow 
    bind:nodes
    bind:edges
    {nodeTypes} 
    {defaultEdgeOptions}
  >
    <Controls />
  </SvelteFlow>
</div>

<style>
  .mindmap-container {
    background-attachment: fixed;
  }
</style>