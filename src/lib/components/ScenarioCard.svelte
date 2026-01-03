<script lang="ts">
    import type { Scenario } from '$lib/models/types';

    const { scenario, ondelete }: { scenario: Scenario, ondelete?: (id: string) => void } = $props();

    function handleDelete() {
        if (confirm(`Are you sure you want to delete "${scenario.prompt}"?`)) {
            ondelete?.(scenario._id || '');
        }
    }

    const emojis = ['📚', '🌟', '🚀', '💡', '🌈', '🔥', '🎉', '🍀', '🎨', '🎭'];
    // Use prompt length to pick a stable emoji for this scenario
    const emoji = emojis[Math.abs(scenario.prompt.length) % emojis.length];
</script>

<div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 group">
    <div class="p-6">
        <div class="flex justify-between items-start mb-4">
            <span class="text-4xl group-hover:scale-110 transition-transform duration-300">{emoji}</span>
            <button 
                onclick={handleDelete}
                data-testid="delete-scenario"
                class="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2"
                aria-label="Delete scenario"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>

        <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2 min-h-[3.5rem]">
            {scenario.prompt}
        </h3>

        <div class="flex items-center text-sm text-gray-500 space-x-4 mb-6">
            <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {scenario.words.length} words
            </span>
            <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(scenario.createdAt).toLocaleDateString()}
            </span>
        </div>

        <a 
            href="/scenario/{scenario._id}" 
            data-testid="open-scenario"
            class="block w-full py-3 px-4 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white font-bold text-center rounded-xl transition-all duration-200 transform active:scale-95"
        >
            Explore Scenario
        </a>
    </div>
</div>