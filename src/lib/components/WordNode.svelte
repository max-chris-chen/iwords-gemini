
<script lang="ts">
  import type { NodeProps } from '@xyflow/svelte';

  export let data: NodeProps['data'];

  function handlePlayAudio() {
    const textToSpeak = data.word.word;
    const url = `http://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(textToSpeak)}&tl=en`;
    const audio = new Audio(url);
    audio.play();
  }
</script>

<div>
  {data.label}
  <button aria-label="play audio" on:click={handlePlayAudio}>🎵</button>
</div>
