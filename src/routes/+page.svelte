<script lang="ts">
    import ScenarioCard from '$lib/components/ScenarioCard.svelte';
    import { invalidateAll } from '$app/navigation';

    let { data } = $props();
    let scenarios = $derived(data.scenarios);

    async function handleDelete(id: string) {
        const response = await fetch(`/api/scenario/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await invalidateAll();
        } else {
            alert('Failed to delete scenario');
        }
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <header class="text-center mb-16">
        <h1 class="text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Master Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Vocabulary</span>
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate immersive language learning scenarios powered by AI. Explore, learn, and grow your English skills.
        </p>
    </header>

    <section>
        <div class="flex justify-between items-center mb-8">
            <h2 class="text-3xl font-black text-gray-900">Your Scenarios</h2>
            <div class="text-sm font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                {scenarios.length} Total
            </div>
        </div>

        {#if scenarios.length > 0}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each scenarios as scenario (scenario._id)}
                    <ScenarioCard {scenario} ondelete={() => handleDelete(scenario._id)} />
                {/each}
            </div>
        {:else}
            <div class="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <span class="text-6xl mb-4 block">🏝️</span>
                <h3 class="text-xl font-bold text-gray-800 mb-2">No scenarios yet</h3>
                <p class="text-gray-500">Enter a prompt in the header to start your journey!</p>
            </div>
        {/if}
    </section>
</div>