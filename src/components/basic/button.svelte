<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    children,
    value,
    isDisabled,
    onClick,
    route,
  }: {
    children?: Snippet;
    value?: string;
    isDisabled?: boolean;
    onClick?: (e: Event) => void;
    route?: string;
  } = $props();
</script>

{#snippet content()}
  {#if children}
    {@render children()}
  {:else}
    {value}
  {/if}
{/snippet}

{#if onClick}
  <button class="button" type="button" disabled={isDisabled} onclick={onClick}>
    {@render content()}
  </button>
{:else}
  <a class="button" type="button" href={isDisabled ? undefined : route}>
    {@render content()}
  </a>
{/if}

<style lang="scss">
  .button {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 6px 10px;
    border-radius: 3px;
    text-decoration: none;
    color: #fff;
    background: fade-out(#000, 0.1);
  }
</style>
