<script lang="ts">
  import { SvelteFlow, Controls, Background } from '@xyflow/svelte';
  import type { Node, Edge } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';
  import { writable } from 'svelte/store';
  import WordNode from './WordNode.svelte';
  import ExampleNode from './ExampleNode.svelte';
  import ScenarioNode from './ScenarioNode.svelte';

  const { nodes: initialNodes, edges: initialEdges }: { nodes: Node[], edges: Edge[] } = $props();

  const nodes = writable(initialNodes);
  const edges = writable(initialEdges);

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

  function onNodeClick(event: CustomEvent<{ event: MouseEvent | TouchEvent, node: Node }>) {
    const clickedNode = event.detail.node;
    const originalEvent = event.detail.event;

    if (clickedNode.type !== 'word') return;

    // Check if the click originated from the toggle button
    const target = originalEvent.target as HTMLElement;
    const toggleBtn = target.closest('.toggle-examples-btn');

    if (!toggleBtn) return; // Ignore clicks elsewhere on the node

    // Toggle logic
    const wordId = clickedNode.id;
    
    // Find edges starting from this word
    edges.update(currentEdges => {
        const connectedEdges = currentEdges.filter(e => e.source === wordId);
        connectedEdges.forEach(e => {
            e.hidden = !e.hidden;
        });
        return [...currentEdges]; // Trigger update
    });

    // Find example nodes connected to this word
    // We can infer them from the edges we just found, or filtering nodes
    nodes.update(currentNodes => {
        // We need to know which nodes to toggle.
        // Option 1: Filter nodes that are targets of the word's edges
        // Option 2: Use naming convention (example-word-...)
        
        // Let's use the edges since we have the source logic
        // But we need to do this efficiently.
        // Re-read edges store is tricky inside this update, but we know the structure.
        
        currentNodes.forEach(n => {
             // Check if it is a child example of the clicked word
             // Using ID convention is safest given our generator: `example-${word.word}-${index}`
             // But `wordId` is `word-${word.word}`
             // So if `n.id` starts with `example-` + `word.word`? 
             // Better: Use edges.
             
             // Let's assume the ID structure from mindmap.ts:
             // wordId: `word-${word}`
             // exampleId: `example-${word}-${index}`
             
             // Extract word key from wordId
             const wordKey = wordId.replace('word-', '');
             if (n.type === 'example' && n.id.startsWith(`example-${wordKey}-`)) {
                 n.hidden = !n.hidden;
             }
        });
        return [...currentNodes];
    });
  }
</script>

<div class="mindmap-container h-full w-full bg-linear-to-br from-slate-50 to-blue-100/50">
  <SvelteFlow 
    nodes={$nodes} 
    edges={$edges} 
    {nodeTypes} 
    {defaultEdgeOptions}
    on:nodeclick={onNodeClick}
  >
    <Controls />
  </SvelteFlow>
</div>

<style>
  .mindmap-container {
    background-attachment: fixed;
  }
</style>