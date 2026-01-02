<!-- src/routes/scenario/[id]/+page.svelte -->
<script lang="ts">
    import MindMap from '$lib/components/MindMap.svelte';

    export let data;

    const { nodes, edges } = data;
</script>

<h1>Mind Map for "{data.scenario.prompt}"</h1>

<div style="height: 80vh; width: 100%;">
    <MindMap {nodes} {edges} />
</div>
