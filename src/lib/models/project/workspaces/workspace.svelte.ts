import { Model, type Document } from '$lib/firebase/firestore.svelte';
import type { WorkspaceData } from '$lib/types/workspace';
import { serialized } from '$lib/utils/object';
import type { WorkspacesModel } from './workspaces.svelte';

export type WorkspacesWorkspaceModelOptions = {
  workspaces: WorkspacesModel;
  doc: Document<WorkspaceData>;
};

export class WorkspacesWorkspaceModel extends Model<WorkspacesWorkspaceModelOptions> {
  workspaces = $derived(this.options.workspaces);
  _doc = $derived(this.options.doc);
  id = $derived(this._doc.id);
  path = $derived(this._doc.path);

  serialized = $derived(serialized(this, ['id']));
}
