<script>
	import Canvas from "$lib/canvas/canvas.svelte";
</script>

<div class="page">
  <div class="container">
    <Canvas/>
  </div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    padding: 15px;
    > .container {
      width: 100%;
      height: 100%;
      outline: 1px solid rgba(255,0,0,0.3);
    }
  }
</style>
