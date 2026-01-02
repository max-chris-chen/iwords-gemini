<script lang="ts">
  import { SvelteFlow, Controls, Background } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';

  const initialNodes = [
    { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
    { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
    { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  ];

  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
  ];
</script>

<div style="height: 500px;">
  <SvelteFlow nodes={initialNodes} edges={initialEdges}>
    <Background />
    <Controls />
  </SvelteFlow>
</div>
