<script lang="ts">
  import type { InputState } from './input-model.svelte';

  let {
    value,
    onBlur,
    onEnter,
    onCreated
  }: {
    value: string;
    onCreated?: (state: InputState) => void;
    onEnter?: (value: string) => boolean | undefined;
    onBlur?: () => boolean | undefined;
  } = $props();

  let element = $state<HTMLInputElement>();

  let rollback = () => {
    if (element) {
      element.value = value;
    }
  };

  $effect(() => {
    onCreated?.({
      rollback: () => rollback()
    });
  });

  let onblur = () => {
    if (onBlur?.() === false) {
      rollback();
    }
  };

  let onkeypress = (e: KeyboardEvent) => {
    if (!element) {
      return;
    }

    let value = element.value;
    if (e.code === 'Enter') {
      if (onEnter?.(value) === false) {
        rollback();
      }
    }
  };
</script>

<input bind:this={element} class="input" type="text" {value} {onblur} {onkeypress} />

<style lang="scss">
  .input {
    min-width: 0;
    display: block;
    padding: 6px 10px;
    border-radius: 3px;
    color: #000;
    border: 1px solid #eee;
  }
</style>
