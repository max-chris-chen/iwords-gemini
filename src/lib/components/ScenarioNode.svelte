<script lang="ts">
  import { Handle, Position, type NodeProps } from '@xyflow/svelte';

  const { data }: NodeProps = $props();
</script>

<div class="w-32 h-32 bg-amber-100/30 backdrop-blur-md border border-amber-200/50 rounded-full shadow-lg text-center flex items-center justify-center aspect-square transition-all hover:scale-105">
  <div class="font-bold text-2xl text-amber-900 px-2 break-words" title={data.label}>
      {data.label}
  </div>
  <Handle type="source" position={Position.Bottom} class="!bg-amber-400 !border-none !w-3 !h-3" />
</div>
