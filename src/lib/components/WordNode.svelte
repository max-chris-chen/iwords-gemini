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

<div class="p-2 bg-white rounded shadow border border-gray-200 min-w-[150px] text-center">
  <Handle type="target" position={Position.Top} class="w-2 h-2" />
  
  <div class="font-bold text-lg mb-1">{data.label}</div>
  
  <button 
    class="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm cursor-pointer"
    aria-label="play audio" 
    on:click={handlePlayAudio}
  >
    🔊 Listen
  </button>

  <Handle type="source" position={Position.Bottom} class="w-2 h-2" />
</div>
