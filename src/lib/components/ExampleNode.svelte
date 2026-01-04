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

<div class="p-4 bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/50 max-w-[280px] text-left hover:shadow-md transition-shadow">
  <Handle type="target" position={Position.Top} class="!w-2 !h-2 !bg-slate-400 !border-none" />
  
  <div class="mb-3 space-y-1">
    <div class="text-sm text-slate-800 leading-snug font-medium">{data.example.en}</div>
    {#if data.example.cn}
      <div class="text-xs text-slate-500 font-normal">{data.example.cn}</div>
    {/if}
  </div>
  
  <div class="flex justify-end">
    <button 
      type="button"
      class="p-1.5 bg-white/80 hover:bg-white text-slate-600 rounded-full border border-slate-200 transition-colors cursor-pointer inline-flex items-center justify-center z-50 shadow-sm"
      aria-label="play audio" 
      onclick={handlePlayAudio}
    >
      <span class="text-sm">🔊</span>
    </button>
  </div>
</div>