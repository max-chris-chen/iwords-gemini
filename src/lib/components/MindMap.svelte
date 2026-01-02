<script lang="ts">
  import { SvelteFlow, Controls, Background } from '@xyflow/svelte';
  import type { Node, Edge } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';

  export let nodes: Node[] = [];
  export let edges: Edge[] = [];
</script>

<SvelteFlow {nodes} {edges}>
  <Background />
  <Controls />
</SvelteFlow>

