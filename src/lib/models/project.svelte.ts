import { firebase } from '$lib/firebase/firebase.svelte';
import { ActivatableModel, Document, QueryAll } from '$lib/firebase/firestore.svelte';
import { type AssetData } from '$lib/types/assets';
import type { ProjectData } from '$lib/types/project';
import { type WorkspaceData, type WorkspaceNodeData } from '$lib/types/workspace';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { collection, doc } from '@firebase/firestore';

export type WorkspaceNodesModelOptions = {
  workspace: WorkspaceModel;
};

export class WorkspaceNodesModel extends ActivatableModel {
  options: WorkspaceNodesModelOptions;

  constructor(options: WorkspaceNodesModelOptions) {
    super();
    this.options = options;
  }

  workspace = $derived.by(() => this.options.workspace);

  get ref() {
    return collection(this.workspace.ref, 'nodes');
  }

  query = new QueryAll<WorkspaceNodeData>(
    options({
      ref: getter(() => this.ref)
    })
  );

  dependencies = [this.query];
}

export type WorkspaceModelOptions = {
  project: ProjectModel;
  id: string;
};

export class WorkspaceModel extends ActivatableModel {
  options: WorkspaceModelOptions;

  constructor(options: WorkspaceModelOptions) {
    super();
    this.options = options;
  }

  project = $derived.by(() => this.options.project);
  id = $derived.by(() => this.options.id);

  get ref() {
    return doc(collection(this.project.ref, 'workspaces'), this.id);
  }

  nodes = new WorkspaceNodesModel({
    workspace: this
  });

  serialized = $derived.by(() => serialized(this, ['id']));

  get dependencies() {
    return [this.project, this.nodes];
  }
}

export type WorkspacesModelOptions = {
  project: ProjectModel;
};

export class WorkspacesModel extends ActivatableModel {
  options: WorkspacesModelOptions;

  constructor(options: WorkspacesModelOptions) {
    super();
    this.options = options;
  }

  ref = $derived.by(() => collection(this.options.project.ref, 'workspaces'));
  path = $derived.by(() => this.ref.path);

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

export class ProjectAssetsModel extends ActivatableModel {
  options: ProjectAssetsModelOptions;

  constructor(options: ProjectAssetsModelOptions) {
    super();
    this.options = options;
  }

  project = $derived.by(() => this.options.project);

  get ref() {
    return collection(this.project.ref, 'assets');
  }

  path = $derived.by(() => this.ref.path);

  query = new QueryAll<AssetData>(
    options({
      ref: getter(() => this.ref)
    })
  );

  get dependencies() {
    return [this.query];
  }

  serialized = $derived.by(() => serialized(this, ['path']));
}

export type ProjectModelOptions = {
  id: string;
};

export class ProjectModel extends ActivatableModel {
  options: ProjectModelOptions;

  constructor(options: ProjectModelOptions) {
    super();
    this.options = options;
  }

  id = $derived.by(() => this.options.id);
  ref = $derived.by(() => doc(collection(firebase.firestore, 'projects'), this.id));

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
