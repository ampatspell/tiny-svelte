<script lang="ts">
  import Icon from '$components/basic/icon.svelte';
  import Terminal from '$icons/lucide-terminal.svelte';
  import { setGlobal } from '$lib/utils/set-global';
  import Item from '../item.svelte';
  import type { HasId } from '../types';

  let { title, model }: { title: string; model: HasId } = $props();
  let id = $derived(model.id);
  let log = () => {
    setGlobal({ model });
  };
</script>

<Item>
  <div class="content">
    <div class="master">
      <div class="title">{title}</div>
      <div class="id">{id}</div>
    </div>
    <!-- svelte-ignore a11y_interactive_supports_focus -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="accessories" role="button" onclick={log}>
      <Icon icon={Terminal} size={12} />
    </div>
  </div>
</Item>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    > .master {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 3px;
      > .title {
        font-weight: 600;
      }
      > .id {
        color: fade-out(#000, 0.5);
      }
    }
    > .accessories {
      display: flex;
      flex-direction: row;
      gap: 5px;
    }
  }
</style>
