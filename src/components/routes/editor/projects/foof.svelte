<script lang="ts">
  import { activate, type Document } from '$lib/firebase/firestore.svelte';

  let { doc }: { doc: Document } = $props();

  $effect(() => {
    activate(doc);
  });
</script>

{doc.description}
