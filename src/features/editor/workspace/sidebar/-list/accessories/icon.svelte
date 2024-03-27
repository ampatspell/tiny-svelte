<script lang="ts">
  import Icon from '$components/basic/icon.svelte';
  import type { EmptyObject } from '$lib/types/types';
  import type { ComponentType, SvelteComponent } from 'svelte';

  let {
    type,
    icon,
  }: {
    type?: 'regular' | 'warning';
    icon: ComponentType<SvelteComponent<EmptyObject>>;
  } = $props();
</script>

<Icon {type} {icon} size={16} />
