<script lang="ts">
  import { Handle, Position, type NodeProps } from '@xyflow/svelte';
  import { audioManager } from '$lib/audio';
  import { fly } from 'svelte/transition';

  const { data }: NodeProps = $props();

  function handlePlayAudio(event: MouseEvent) {
    event.stopPropagation();
    
    if (data?.word?.word) {
        audioManager.speak(data.word.word);
    }
  }
</script>

<div 
  in:fly={{ y: 20, duration: 400 }}
  class="p-4 bg-indigo-50/80 backdrop-blur-md rounded-xl shadow-lg border border-indigo-200/50 min-w-[180px] max-w-[300px] text-center transition-all hover:shadow-xl hover:bg-indigo-50/90"
>
  <Handle type="target" position={Position.Top} class="!w-3 !h-3 !bg-indigo-400 !border-none" />
  
  <div class="flex flex-col gap-1 mb-3">
    <div class="font-bold text-2xl text-indigo-900 tracking-tight">{data.word.word}</div>
    {#if data.word.phonetics}
      <div class="text-sm text-indigo-500 font-serif">{data.word.phonetics}</div>
    {/if}
    {#if data.word.definition_cn}
      <div class="text-md text-amber-700 font-medium">{data.word.definition_cn}</div>
    {/if}
    <div class="text-xs text-slate-600 italic mt-1 px-2">{data.word.definition}</div>
  </div>
  
  <div class="flex justify-between items-center mt-2">
    <button 
      type="button"
      class="p-2 bg-indigo-100/80 hover:bg-indigo-200 text-indigo-600 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center z-50 shadow-sm backdrop-blur-sm"
      aria-label="play audio" 
      onclick={handlePlayAudio}
    >
      <span class="text-lg">🔊</span>
    </button>

    <div
      role="button"
      tabindex="0"
      class="toggle-examples-btn p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-400 hover:text-indigo-600 rounded-md transition-colors cursor-pointer z-50 ml-auto flex items-center justify-center"
      aria-label="toggle examples"
    >
      <span class="text-xs font-bold tracking-tighter pointer-events-none">>></span>
    </div>
  </div>

  <Handle type="source" position={Position.Bottom} class="!w-3 !h-3 !bg-indigo-400 !border-none" />
</div>
