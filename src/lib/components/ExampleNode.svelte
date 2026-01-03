<script lang="ts">
  import { Handle, Position, type NodeProps } from '@xyflow/svelte';
  import { audioManager } from '$lib/audio';

  const { data }: NodeProps = $props();

  function handlePlayAudio(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    if (data?.example?.en) {
        audioManager.speak(data.example.en);
    }
  }
</script>

<div class="p-3 bg-gray-50 rounded shadow border border-gray-100 max-w-[250px] text-left">
  <Handle type="target" position={Position.Top} class="w-2 h-2" />
  
  <div class="mb-2">
    <div class="text-sm text-gray-800 leading-tight mb-1">{data.example.en}</div>
    {#if data.example.cn}
      <div class="text-xs text-gray-500">{data.example.cn}</div>
    {/if}
  </div>
  
  <div class="flex justify-end">
    <button 
      type="button"
      class="p-1.5 bg-white hover:bg-gray-100 text-gray-600 rounded-full border border-gray-200 transition-colors cursor-pointer inline-flex items-center justify-center z-50"
      aria-label="play audio" 
      onclick={handlePlayAudio}
    >
      <span class="text-sm">🔊</span>
    </button>
  </div>

  <Handle type="source" position={Position.Bottom} class="w-2 h-2" />
</div>