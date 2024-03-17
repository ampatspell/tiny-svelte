import { ProjectsModel } from '$lib/models/projects/projects.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  return {
    projects: new ProjectsModel({})
  };
};
