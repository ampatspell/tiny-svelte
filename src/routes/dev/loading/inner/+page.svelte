<script lang="ts">
  let { data } = $props();
</script>

<div class="page">
  <a href="/dev/loading">loading</a> / <a href="/dev/loading/inner">inner ({data.inner})</a>
</div>

<style lang="scss">
  .page {
    padding: 10px;
  }
</style>
