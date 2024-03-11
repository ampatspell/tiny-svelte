import type { PageLoad } from './$types';

export const load: PageLoad = (event) => {
  const project = event.params.project;
  return {
    project
  };
};
