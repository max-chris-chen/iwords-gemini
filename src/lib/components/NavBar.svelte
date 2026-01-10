<script lang="ts">
    import CapsuleInput from './CapsuleInput.svelte';
    import { goto } from '$app/navigation';

    let { user } = $props<{ user?: { id: string; username: string } | null }>();

    let isLoading = $state(false);

    async function handleGenerate(prompt: string) {
        if (!prompt) return;

        isLoading = true;

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (response.ok) {
                const result = await response.json();
                const scenarioId = result._id;
                await goto(`/scenario/${scenarioId}`);
            } else {
                const errorData = await response.json();
                console.error('Failed to generate scenario:', errorData);
                alert(`Error: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Network or unexpected error:', error);
            alert('An unexpected error occurred.');
        } finally {
            isLoading = false;
        }
    }
</script>

<nav class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-4 sm:p-6 text-white flex justify-between items-center shadow-xl mb-8 gap-4">
    <a href="/" class="text-3xl font-black tracking-tighter hover:scale-105 transition-transform duration-200 shrink-0">
        iWords
    </a>
    
    <div class="flex-grow flex justify-center max-w-xl mx-4">
        <CapsuleInput onsubmit={handleGenerate} {isLoading} />
    </div>

    <ul class="flex space-x-6 text-lg font-bold shrink-0 items-center">
        <li>
            <a href="/" data-testid="home-link" class="hover:text-yellow-300 transition-colors duration-200">Public Gallery</a>
        </li>
        {#if user}
            <li>
                <a href="/dashboard" class="hover:text-yellow-300 transition-colors duration-200">Dashboard</a>
            </li>
            <li class="hidden sm:block">
                 <span class="text-sm font-normal opacity-80 border border-white/30 rounded px-2 py-1">{user.username}</span>
            </li>
            <li>
                <form action="/logout" method="POST" class="inline">
                    <button type="submit" class="hover:text-yellow-300 transition-colors duration-200 cursor-pointer">Logout</button>
                </form>
            </li>
        {:else}
            <li>
                <a href="/login" class="hover:text-yellow-300 transition-colors duration-200">Login</a>
            </li>
        {/if}
    </ul>
</nav>