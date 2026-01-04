<script lang="ts">
  import { Handle, Position, type NodeProps, useSvelteFlow } from '@xyflow/svelte';
  import { audioManager } from '$lib/audio';

  const { data, id }: NodeProps = $props();
  const { setNodes, setEdges } = useSvelteFlow();

  function handlePlayAudio(event: MouseEvent) {
    // 必须同步调用，不能有 await
    event.stopPropagation();
    
    if (data?.word?.word) {
        audioManager.speak(data.word.word);
    }
  }

  function handleToggleExamples(event: MouseEvent) {
    event.stopPropagation();
    
    const wordId = id;
    const wordKey = wordId.replace('word-', '');

    // Toggle edges
    setEdges((eds) => 
      eds.map((e) => {
        if (e.source === wordId) {
          return { ...e, hidden: !e.hidden };
        }
        return e;
      })
    );

    // Toggle nodes
    setNodes((nds) => 
      nds.map((n) => {
        if (n.type === 'example' && n.id.startsWith(`example-${wordKey}-`)) {
          return { ...n, hidden: !n.hidden };
        }
        return n;
      })
    );
  }
</script>

<div class="p-4 bg-indigo-50/80 backdrop-blur-md rounded-xl shadow-lg border border-indigo-200/50 min-w-[180px] max-w-[300px] text-center transition-all hover:shadow-xl hover:bg-indigo-50/90">
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

    <button
      type="button" 
      class="toggle-examples-btn p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-400 hover:text-indigo-600 rounded-md transition-colors cursor-pointer z-50 ml-auto"
      aria-label="toggle examples"
      onclick={handleToggleExamples}
    >
      <span class="text-xs font-bold tracking-tighter">>></span>
    </button>
  </div>

  <Handle type="source" position={Position.Bottom} class="!w-3 !h-3 !bg-indigo-400 !border-none" />
</div>
