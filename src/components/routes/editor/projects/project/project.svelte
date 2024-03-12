<script lang="ts">
  let { id } = $props<{
    id: string;
  }>();
</script>

<div class="project">
  {id}
</div>

<style lang="scss">
  .project {
    padding: 10px;
  }
</style>
