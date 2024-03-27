<script lang="ts">
  import Alert from '$icons/lucide-circle-alert.svelte';
  let size = 30;
</script>

<div class="missing" style:--size="{size}px">
  <Alert />
</div>

<style lang="scss">
  .missing {
    color: #e63946;
    width: var(--size);
    height: var(--size);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5px;
  }
</style>
