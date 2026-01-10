<script lang="ts">
    import ScenarioCard from '$lib/components/ScenarioCard.svelte';
    import { invalidateAll } from '$app/navigation';

    let { data } = $props();
    let scenarios = $derived(data.scenarios);
    let user = $derived(data.user);

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this scenario?')) return;
        
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
    <header class="mb-12">
        <h1 class="text-3xl font-bold text-gray-900">Welcome, {user.username}!</h1>
        <p class="text-gray-600 mt-2">Manage your personal scenarios here.</p>
    </header>

    <section>
        <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-bold text-gray-900">My Scenarios</h2>
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
                <span class="text-6xl mb-4 block">📝</span>
                <h3 class="text-xl font-bold text-gray-800 mb-2">No scenarios yet</h3>
                <p class="text-gray-500">Create your first scenario to get started!</p>
            </div>
        {/if}
    </section>
</div>
