<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let isLoading: boolean = false;
    let scenarioPrompt: string = '';
    const dispatch = createEventDispatcher();

    function handleGenerate() {
        if (scenarioPrompt.trim() && !isLoading) {
            dispatch('generate', scenarioPrompt);
            // Don't clear immediately, let parent handle success or we clear on success? 
            // The original code cleared it. Let's keep it, but maybe better to clear only on success.
            // For now, let's keep original behavior of clearing, but the user won't be able to type anyway.
            scenarioPrompt = ''; 
        }
    }
</script>

<div class="flex flex-col items-center p-4 space-y-4">
    <textarea
        bind:value={scenarioPrompt}
        placeholder="Enter your scenario here (e.g., 'a day at the beach')"
        class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
        rows="4"
        disabled={isLoading}
    ></textarea>
    <button
        type="button"
        on:click={handleGenerate}
        disabled={isLoading}
        class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {isLoading ? 'Generating...' : 'Generate Scenario'}
    </button>
</div>
