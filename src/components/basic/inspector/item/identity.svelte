<script lang="ts">
  import Item from '../item.svelte';

  let { title }: { title: string } = $props();
</script>

<Item>
  <div class="content">
    <div class="title">{title}</div>
  </div>
</Item>

<style lang="scss">
  .content {
    min-height: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    > .title {
      font-weight: 600;
    }
  }
</style>
