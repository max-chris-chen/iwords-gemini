<script lang="ts">
  import ScenarioInput from '$lib/components/ScenarioInput.svelte';
  import { goto } from '$app/navigation';
  import { onDestroy } from 'svelte';

  let isLoading = false;
  let loadingMessage = '';
  let messageInterval: any;

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

  onDestroy(() => {
    stopLoadingMessages();
  });

  async function handleGenerate(event: CustomEvent<string>) {
    const prompt = event.detail;
    if (!prompt) return;

    isLoading = true;
    startLoadingMessages();

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
      stopLoadingMessages();
    }
  }
</script>

<div class="container mx-auto p-4 max-w-2xl">
  <h1 class="text-3xl font-bold text-center mb-6">Generate New Scenario</h1>
  <ScenarioInput on:generate={handleGenerate} {isLoading} />
  
  {#if isLoading}
    <div class="mt-4 text-center text-blue-600 font-medium animate-pulse">
      {loadingMessage}
    </div>
  {/if}
</div>
