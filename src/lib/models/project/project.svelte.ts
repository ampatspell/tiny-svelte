import { firebase } from '$lib/firebase/firebase.svelte';
import type { ProjectData } from '$lib/types/project';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { collection, doc } from '@firebase/firestore';
import { ProjectAssetsModel } from './assets.svelte';
import { WorkspacesModel } from './workspaces/workspaces.svelte';
import { Model } from '$lib/firebase/fire/model.svelte';
import { Document } from '$lib/firebase/fire/document.svelte';

export type ProjectModelOptions = {
  id: string;
};

export class ProjectModel extends Model<ProjectModelOptions> {
  id = $derived(this.options.id);
  ref = $derived(doc(collection(firebase.firestore, 'projects'), this.id));
  path = $derived(this.ref.path);

  _doc = new Document<ProjectData>(
    options({
      ref: getter(() => this.ref)
    })
  );

  identifier = $derived(this._doc.data?.identifier);

  workspaces = new WorkspacesModel({
    project: this
  });

  assets = new ProjectAssetsModel({
    project: this
  });

  serialized = $derived(serialized(this, ['id', 'identifier']));

  dependencies = [this._doc, this.workspaces, this.assets];

  async load() {
    const doc = this._doc.promises.cached;
    const workspaces = this.workspaces.load();
    const assets = this.assets.load();
    await Promise.all([doc, workspaces, assets]);
  }
}
