<!-- src/routes/scenario/[id]/+page.svelte -->
<script lang="ts">
    import MindMap from '$lib/components/MindMap.svelte';

    let { data } = $props();

    const { nodes, edges } = data;
    let wordCount = $state(data.scenario.words.length);

    async function handleTogglePublic(isPublic: boolean) {
        const response = await fetch(`/api/scenario/${data.scenario._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isPublic })
        });

        if (!response.ok) {
            alert('Failed to update visibility');
        }
    }

    function handleShare() {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    }
</script>

<div class="p-4 sm:p-6 bg-linear-to-br from-slate-50 to-blue-50 min-h-screen">
    <div class="max-w-7xl mx-auto mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <a href="/" class="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mb-2 transition-colors">
                    <span>←</span> Back to Scenarios
                </a>
                <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Mind Map for 
                    <span class="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
                        "{data.scenario.prompt}"
                    </span>
                </h1>
                <p class="text-slate-500 mt-1 text-sm sm:text-base">Explore related vocabulary and example sentences</p>
            </div>
            
            <div class="flex flex-wrap items-center gap-2">
                {#if data.isOwner}
                    <div class="flex items-center bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-3 py-1 gap-2 shadow-xs">
                        <span class="text-xs font-semibold text-slate-600">Public Gallery</span>
                        <input 
                            type="checkbox" 
                            checked={data.scenario.isPublic} 
                            onchange={(e) => handleTogglePublic(e.currentTarget.checked)}
                            class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                    </div>
                {/if}
                <button 
                    onclick={handleShare}
                    class="px-3 py-1 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full text-xs font-semibold text-slate-600 shadow-xs hover:bg-white transition-colors cursor-pointer"
                >
                    Share Link
                </button>
                <div class="px-3 py-1 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full text-xs font-semibold text-slate-600 shadow-xs">
                    {wordCount} Words
                </div>
                <div class="px-3 py-1 bg-indigo-50 backdrop-blur-sm border border-indigo-100 rounded-full text-xs font-semibold text-indigo-600 shadow-xs">
                    AI Generated
                </div>
            </div>
        </div>
    </div>

    <div class="bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-xl overflow-hidden relative" style="height: 75vh; width: 100%;">
        <MindMap {nodes} {edges} scenarioId={data.scenario._id} onWordsUpdated={(count) => wordCount = count} />
    </div>
</div>
