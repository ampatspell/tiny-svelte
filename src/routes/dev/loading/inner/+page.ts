import type { PageLoad } from './$types';

let index = 0;

export const load: PageLoad = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  index++;
  return {
    inner: index,
  };
};
