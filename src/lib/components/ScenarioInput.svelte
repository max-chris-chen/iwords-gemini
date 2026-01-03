<script lang="ts">
    import { createEventDispatcher, onDestroy } from 'svelte';

    const { isLoading = false }: { isLoading?: boolean } = $props();
    let scenarioPrompt = $state('');
    let loadingMessage = $state('');
    let messageInterval: any;

    const dispatch = createEventDispatcher();

    const loadingMessages = [
        "Initializing request...",
        "Consulting AI architect...",
        "Designing mind map structure...",
        "Populating vocabulary...",
        "Finalizing scenario..."
    ];

    function startLoadingMessages() {
        let index = 0;
        loadingMessage = loadingMessages[0];
        messageInterval = setInterval(() => {
            index = (index + 1) % loadingMessages.length;
            loadingMessage = loadingMessages[index];
        }, 2000);
    }

    function stopLoadingMessages() {
        if (messageInterval) clearInterval(messageInterval);
        loadingMessage = '';
    }

    $effect(() => {
        if (isLoading) {
            startLoadingMessages();
        } else {
            stopLoadingMessages();
        }
    });

    onDestroy(() => {
        stopLoadingMessages();
    });

    function handleGenerate() {
        if (scenarioPrompt.trim() && !isLoading) {
            dispatch('generate', scenarioPrompt);
            scenarioPrompt = '';
        }
    }
</script>

<div class="space-y-6">
    <textarea
        bind:value={scenarioPrompt}
        placeholder="e.g., A job interview for a software engineer, or Ordering coffee at a busy Parisian café..."
        class="w-full p-6 text-lg border-2 border-indigo-50 rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-200 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 placeholder:text-gray-400"
        rows="4"
        disabled={isLoading}
    ></textarea>
    
    <div class="flex flex-col items-center space-y-4">
        <button
            type="button"
            onclick={handleGenerate}
            disabled={isLoading || !scenarioPrompt.trim()}
            class="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xl rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
            {#if isLoading}
                <span class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                </span>
            {:else}
                Generate Scenario
            {/if}
        </button>

        {#if isLoading}
            <p class="text-indigo-600 font-bold animate-pulse text-lg">
                {loadingMessage}
            </p>
        {/if}
    </div>
</div>