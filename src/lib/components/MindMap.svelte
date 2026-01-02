<script lang="ts">
  import { SvelteFlow, Controls, Background } from '@xyflow/svelte';
  import type { Node, Edge } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';
  import WordNode from './WordNode.svelte';

  export let nodes: Node[] = [];
  export let edges: Edge[] = [];

  const nodeTypes = {
    word: WordNode,
  };
</script>

<SvelteFlow {nodes} {edges} {nodeTypes}>
  <Background />
  <Controls />
</SvelteFlow>

