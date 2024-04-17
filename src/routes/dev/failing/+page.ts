import type { PageLoad } from './$types';
import { Things } from './model.svelte';

export const load: PageLoad = async () => {
  const things = new Things();
  return {
    things,
  };
};
