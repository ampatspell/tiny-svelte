<script lang="ts">
  import Button from '$components/basic/button.svelte';
  import { untrack } from 'svelte';

  let foo = $state<any>();

  let needsSet = $state(false);

  $effect(() => {
    if (needsSet) {
      foo = { position: { x: 100, y: 100 } };
      console.log(foo);
      untrack(() => {
        needsSet = false;
      });
    }
  });

  let onClick = () => {
    needsSet = true;
  };
</script>

{foo?.position?.x}, {foo?.position?.y}

<Button value="Toggle" {onClick} />
