<script lang="ts">
  import type { ProjectAssetModel } from '$lib/models/project/asset.svelte';
  import Identity from './identity.svelte';

  let { model }: { model: ProjectAssetModel } = $props();

  let title = $derived(model.humanType);
</script>

<Identity {title} {model} />
