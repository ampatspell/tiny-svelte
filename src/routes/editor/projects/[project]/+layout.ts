import { ProjectModel } from '$lib/models/project/project.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
  const project = new ProjectModel({ id: event.params.project });
  return {
    project
  };
};
