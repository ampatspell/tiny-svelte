<script lang="ts">
  let { name }: { name: string } = $props();
</script>

<div class="dropdown-popup">
  popup: {name}
</div>

<style lang="scss">
  .dropdown-popup {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 300px;
    height: 300px;
    background: rgba(255, 0, 0, 0.1);
  }
</style>
