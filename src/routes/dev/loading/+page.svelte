<script lang="ts">
  let { data } = $props();
</script>

<div class="page">
  <a href="/dev/loading">loading ({data.loading})</a> / <a href="/dev/loading/inner">inner</a>
</div>

<style lang="scss">
  .page {
    padding: 10px;
  }
</style>
