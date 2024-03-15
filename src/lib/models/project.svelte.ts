import { firebase } from '$lib/firebase/firebase.svelte';
import { ActivatableModel, Document, Model, Models, QueryAll } from '$lib/firebase/firestore.svelte';
import { type AssetData } from '$lib/types/assets';
import type { ProjectData } from '$lib/types/project';
import { type WorkspaceData, type WorkspaceNodeData } from '$lib/types/workspace';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { collection, doc } from '@firebase/firestore';

export type WorkspaceNodeModelOptions = {
  nodes: WorkspaceNodesModelOptions;
  doc: Document<WorkspaceNodeData>;
};

export class WorkspaceNodeModel extends Model<WorkspaceNodeModelOptions> {
  doc = $derived(this.options.doc);
  id = $derived(this.doc.id);
  position = $derived(this.doc.data!.position);
  assetIdentifier = $derived(this.doc.data!.asset);

  _assets = $derived(this.options.nodes.workspace.project.assets);

  asset = $derived.by(() => {
    const identifier = this.assetIdentifier;
    const doc = this._assets.query.content.find((doc) => doc.data?.identifier === identifier);
    return doc;
  });

  serialized = $derived(serialized(this, ['id', 'assetIdentifier', 'asset']));
}

export type WorkspaceNodesModelOptions = {
  workspace: WorkspaceModel;
};

export class WorkspaceNodesModel extends ActivatableModel<WorkspaceNodesModelOptions> {
  workspace = $derived(this.options.workspace);
  ref = $derived(collection(this.workspace.ref, 'nodes'));

  query = new QueryAll<WorkspaceNodeData>(
    options({
      ref: getter(() => this.ref)
    })
  );

  all = new Models(
    options({
      source: getter(() => this.query.content),
      model: (doc: Document<WorkspaceNodeData>) =>
        new WorkspaceNodeModel({
          nodes: this,
          doc
        })
    })
  );

  dependencies = [this.query];
}

export type WorkspaceModelOptions = {
  project: ProjectModel;
  id: string;
};

export class WorkspaceModel extends ActivatableModel<WorkspaceModelOptions> {
  project = $derived(this.options.project);
  id = $derived(this.options.id);
  ref = $derived(doc(collection(this.project.ref, 'workspaces'), this.id));

  nodes = new WorkspaceNodesModel({
    workspace: this
  });

  serialized = $derived(serialized(this, ['id']));

  dependencies = [this.project, this.nodes];
}

export type WorkspacesModelOptions = {
  project: ProjectModel;
};

export class WorkspacesModel extends ActivatableModel<WorkspacesModelOptions> {
  ref = $derived(collection(this.options.project.ref, 'workspaces'));
  path = $derived(this.ref.path);

  query = new QueryAll<WorkspaceData>(
    options({
      ref: getter(() => this.ref)
    })
  );

  serialized = $derived.by(() => serialized(this, ['path']));
  dependencies = [this.query];
}

export type ProjectAssetsModelOptions = {
  project: ProjectModel;
};

export class ProjectAssetsModel extends ActivatableModel<ProjectAssetsModelOptions> {
  project = $derived(this.options.project);
  ref = $derived(collection(this.project.ref, 'assets'));
  path = $derived(this.ref.path);

  query = new QueryAll<AssetData>(
    options({
      ref: getter(() => this.ref)
    })
  );

  dependencies = [this.query];

  serialized = $derived.by(() => serialized(this, ['path']));
}

export type ProjectModelOptions = {
  id: string;
};

export class ProjectModel extends ActivatableModel<ProjectModelOptions> {
  id = $derived(this.options.id);
  ref = $derived(doc(collection(firebase.firestore, 'projects'), this.id));

  doc = new Document<ProjectData>(
    options({
      ref: getter(() => this.ref)
    })
  );

  identifier = $derived.by(() => this.doc.data?.identifier);

  workspaces = new WorkspacesModel({
    project: this
  });

  assets = new ProjectAssetsModel({
    project: this
  });

  serialized = $derived.by(() => serialized(this, ['id', 'identifier']));

  dependencies = [this.doc, this.workspaces, this.assets];
}
