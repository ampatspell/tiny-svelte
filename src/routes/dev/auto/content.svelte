<script lang="ts">
  import Button from '$components/basic/button.svelte';
  import Json from '$components/basic/json.svelte';
  import { Document, subscribe } from '$lib/firebase/fire.svelte';
  import { firebase } from '$lib/firebase/firebase.svelte';
  import { getter, options } from '$lib/utils/args';
  import { doc } from '@firebase/firestore';
    import { onMount } from 'svelte';

  let id = $state('hello');

  let document = new Document(
    options({
      ref: getter(() => doc(firebase.firestore, `projects/${id}`))
    })
  );

  subscribe(document);

  let toggleId = () => {
    id = id === 'hello' ? 'kitty' : 'hello';
  };
</script>

<div class="page">
  <div class="row"><Button value="Toggle id" onClick={toggleId} /></div>
  <div class="row">{document.id}</div>
  <div class="row">{document.isLoading}</div>
  <div class="row"><Json value={document.data} /></div>
</div>

<style lang="scss">
  .page {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
</style>
