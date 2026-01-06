<script lang="ts">
  let { placeholder = "Create new scenario..." } = $props();
</script>

<div class="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm transition-all duration-300 w-32 border border-gray-200">
  <input
    type="text"
    {placeholder}
    class="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400"
  />
  <button
    aria-label="Create scenario"
    class="ml-2 p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  </button>
</div>