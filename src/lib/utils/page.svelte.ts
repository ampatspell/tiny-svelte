import { page } from '$app/stores';
import type { Page } from '@sveltejs/kit';

export const useCurrentRoute = () => {
  let value = $state<Page<Record<string, string>, string | null>>();
  $effect(() => {
    return page.subscribe((page) => {
      value = page;
    });
  });
  return {
    get value() {
      return value;
    },
  };
};
