import { WorkspaceModel } from '$lib/models/project/workspace.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
  const { project } = await event.parent();
  const workspace = new WorkspaceModel({ project, id: event.params.workspace });
  return {
    workspace
  };
};
