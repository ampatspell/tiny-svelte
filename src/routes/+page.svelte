<script>
  import Editor from '$icons/lucide-gamepad.svelte';
</script>

<div class="page">
  <a class="editor" href="/editor">
    <Editor />
  </a>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    > .editor {
      display: flex;
      :global(> svg) {
        $s: 20px;
        width: $s;
        height: $s;
      }
    }
  }
</style>
