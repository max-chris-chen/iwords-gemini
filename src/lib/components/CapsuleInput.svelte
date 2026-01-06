<script lang="ts">
  let { placeholder = "Create new scenario...", onsubmit } = $props();
  let value = $state("");
  let isFocused = $state(false);
  let inputRef: HTMLInputElement | undefined = $state();

  let isExpanded = $derived(isFocused || value.length > 0);

  function handleSubmit() {
    if (value.trim() && onsubmit) {
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
  class="flex items-center bg-white rounded-full px-4 py-2 shadow-sm transition-all duration-300 border border-gray-200 box-content focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent"
  class:w-32={!isExpanded}
  class:w-64={isExpanded}
>
  <input
    bind:this={inputRef}
    type="text"
    {placeholder}
    bind:value
    onfocus={() => isFocused = true}
    onblur={() => isFocused = false}
    onkeydown={handleKeydown}
    class="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400 min-w-0"
  />
  <button
    aria-label="Create scenario"
    class="ml-2 p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors shrink-0"
    onclick={handleSubmit}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  </button>
</div>
