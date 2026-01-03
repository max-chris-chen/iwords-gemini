<script lang="ts">
  import { Handle, Position, type NodeProps } from '@xyflow/svelte';

  export let data: NodeProps['data'];

  function handlePlayAudio(event: MouseEvent) {
    event.stopPropagation(); // Prevent node selection when clicking button
    if (data?.word?.word) {
        const textToSpeak = data.word.word;
        
        // Use the Web Speech API
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    } else {
        console.warn("No word data found for audio");
    }
  }
</script>

<div class="p-3 bg-white rounded-lg shadow-md border border-gray-200 min-w-[180px] text-center">
  <Handle type="target" position={Position.Top} class="w-3 h-3 bg-blue-400" />
  
  <div class="flex flex-col gap-1 mb-2">
    <div class="font-bold text-xl text-indigo-700">{data.word.word}</div>
    {#if data.word.phonetics}
      <div class="text-sm text-gray-500 font-serif">{data.word.phonetics}</div>
    {/if}
    {#if data.word.definition_cn}
      <div class="text-md text-orange-600 font-medium">{data.word.definition_cn}</div>
    {/if}
    <div class="text-xs text-gray-600 italic mt-1">{data.word.definition}</div>
  </div>
  
  <button 
    class="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center"
    aria-label="play audio" 
    on:click={handlePlayAudio}
  >
    <span class="text-lg">🔊</span>
  </button>

  <Handle type="source" position={Position.Bottom} class="w-3 h-3 bg-blue-400" />
</div>
