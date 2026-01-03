<script lang="ts">
  import { SvelteFlow, Controls, Background } from '@xyflow/svelte';
  import type { Node, Edge } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';
  import WordNode from './WordNode.svelte';
  import ExampleNode from './ExampleNode.svelte';

  const { nodes, edges }: { nodes: Node[], edges: Edge[] } = $props();

  const nodeTypes = {
    word: WordNode,
    example: ExampleNode,
  };
</script>

<div style="height: 100%; width: 100%;">
  <SvelteFlow {nodes} {edges} {nodeTypes}>
    <Background />
    <Controls />
  </SvelteFlow>
</div>