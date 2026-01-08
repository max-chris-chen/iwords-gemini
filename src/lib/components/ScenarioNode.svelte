<script lang="ts">
  import { Handle, Position, type NodeProps } from '@xyflow/svelte';

  const { data }: NodeProps = $props();

  const handleExpand = (e: MouseEvent) => {
    e.stopPropagation();
    if (data.onExpand) {
      data.onExpand();
    }
  };
</script>

<div class="relative w-32 h-32 bg-amber-100/30 backdrop-blur-md border border-amber-200/50 rounded-full shadow-lg text-center flex items-center justify-center aspect-square transition-all hover:scale-105">
  {#if data.isExpanding}
    <div 
      data-testid="loading-indicator"
      class="absolute inset-0 flex items-center justify-center bg-amber-50/50 rounded-full z-10"
    >
      <div class="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {/if}

  <div class="font-bold text-2xl text-amber-900 px-2 break-words" title={data.label}>
      {data.label}
  </div>

  <button
    onclick={handleExpand}
    disabled={data.isExpanding || data.isLocked}
    class="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-400 text-white rounded-full flex items-center justify-center shadow-md hover:bg-amber-500 transition-colors z-20 disabled:opacity-50 disabled:cursor-not-allowed"
    aria-label="Expand scenario"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
    </svg>
  </button>

  <Handle type="source" position={Position.Bottom} class="!bg-amber-400 !border-none !w-3 !h-3" />
</div>
