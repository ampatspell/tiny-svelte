<script lang="ts">
  import Button from '$lib/editor/button.svelte';
  import { firebase } from '$lib/firebase/firebase.svelte';

  let session = firebase.session;
</script>

{#if session.isLoaded}
  <div class="user">{session.user?.uid} {session.user?.email}</div>
{/if}
