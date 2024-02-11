<script lang="ts">
	import type { Position, Size } from "$lib/types";

  let { position, size, fill } = $props<{
    position?: Position;
    size: Size;
    fill: string;
  }>();

</script>
