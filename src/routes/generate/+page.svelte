<script lang="ts">
  import ScenarioInput from '$lib/components/ScenarioInput.svelte';
  import { goto } from '$app/navigation';

  async function handleGenerate(event: CustomEvent<string>) {
    const prompt = event.detail;
    if (!prompt) return;

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
        const scenarioId = result.scenarioId;
        await goto(`/scenario/${scenarioId}`);
      } else {
        const errorData = await response.json();
        console.error('Failed to generate scenario:', errorData);
        alert(`Error: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network or unexpected error:', error);
      alert('An unexpected error occurred.');
    }
  }
</script>

<div class="container mx-auto p-4 max-w-2xl">
  <h1 class="text-3xl font-bold text-center mb-6">Generate New Scenario</h1>
  <ScenarioInput on:generate={handleGenerate} />
</div>
