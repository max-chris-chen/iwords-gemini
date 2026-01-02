<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    let scenarioPrompt: string = '';
    const dispatch = createEventDispatcher();

    function handleSubmit() {
        if (scenarioPrompt.trim()) {
            dispatch('generate', scenarioPrompt);
            scenarioPrompt = ''; // Clear input after dispatch
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit} class="flex flex-col items-center p-4 space-y-4">
    <textarea
        bind:value={scenarioPrompt}
        placeholder="Enter your scenario here (e.g., 'a day at the beach')"
        class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="4"
    ></textarea>
    <button
        type="submit"
        class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
        Generate Scenario
    </button>
</form>
