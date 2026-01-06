<script lang="ts">
  let { placeholder = "Create new scenario...", onsubmit, isLoading = false } = $props();
  let value = $state("");
  let isFocused = $state(false);
  let inputRef: HTMLInputElement | undefined = $state();

  let isExpanded = $derived(isFocused || value.length > 0 || isLoading);

  function handleSubmit() {
    if (value.trim() && onsubmit && !isLoading) {
      onsubmit(value.trim());
      value = "";
      inputRef?.blur();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<div 
  class="flex items-center bg-white rounded-full px-4 py-2 shadow-sm transition-all duration-300 border border-gray-200 box-content focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent max-w-full"
  class:w-48={!isExpanded}
  class:w-80={isExpanded}
>
  <input
    bind:this={inputRef}
    type="text"
    {placeholder}
    bind:value
    disabled={isLoading}
    onfocus={() => isFocused = true}
    onblur={() => isFocused = false}
    onkeydown={handleKeydown}
    class="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400 min-w-0 disabled:opacity-50"
  />
  <button
    aria-label={isLoading ? "Generating..." : "Create scenario"}
    class="ml-2 p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
    onclick={handleSubmit}
    disabled={isLoading}
  >
    {#if isLoading}
      <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="2" x2="12" y2="6"></line>
        <line x1="12" y1="18" x2="12" y2="22"></line>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
        <line x1="2" y1="12" x2="6" y2="12"></line>
        <line x1="18" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
      </svg>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    {/if}
  </button>
</div>