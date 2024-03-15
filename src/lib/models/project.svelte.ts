import { firebase } from '$lib/firebase/firebase.svelte';
import { ActivatableModel, Document, Model, Models, QueryAll } from '$lib/firebase/firestore.svelte';
import { type AssetData, type BoxAssetData } from '$lib/types/assets';
import type { ProjectData } from '$lib/types/project';
import { type WorkspaceData, type WorkspaceNodeData } from '$lib/types/workspace';
import { getter, options } from '$lib/utils/args';
import { serialized } from '$lib/utils/object';
import { collection, doc, type DocumentData } from '@firebase/firestore';

export type AssetByIdentifier = (identifier: string) => ProjectAssetModel | undefined;

export type WorkspaceNodeModelOptions = {
  nodes: WorkspaceNodesModelOptions;
  doc: Document<WorkspaceNodeData>;
  asset: AssetByIdentifier;
};

export class WorkspaceNodeModel extends Model<WorkspaceNodeModelOptions> {
  doc = $derived(this.options.doc);
  id = $derived(this.doc.id);
  position = $derived(this.doc.data!.position);
  assetIdentifier = $derived(this.doc.data!.asset);
  asset = $derived(this.options.asset(this.assetIdentifier));

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

  assetByIdentifier(identifier: string) {
    return this.workspace.project.assets.all.content.find((asset) => asset?.identifier === identifier);
  }

  all = new Models(
    options({
      source: getter(() => this.query.content),
      model: (doc: Document<WorkspaceNodeData>) =>
        new WorkspaceNodeModel({
          nodes: this,
          doc,
          asset: (identifier) => this.assetByIdentifier(identifier)
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

  serialized = $derived(serialized(this, ['path']));
  dependencies = [this.query];
}

//

export type ProjectAssetModelOptions<D extends DocumentData> = {
  assets: ProjectAssetsModel;
  doc: Document<D>;
};

export class ProjectAssetModel<D extends DocumentData = DocumentData> extends Model<ProjectAssetModelOptions<D>> {
  doc = $derived(this.options.doc);
  id = $derived(this.doc.id);
  identifier = $derived(this.doc.data?.identifier);

  serialized = $derived(serialized(this, ['id', 'identifier']));
}

export class ProjectBoxAssetModel extends ProjectAssetModel<BoxAssetData> {}

//

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

  all = new Models(
    options({
      source: getter(() => this.query.content),
      model: (doc: Document<AssetData>) => {
        const type = doc.data?.type;
        if (!type) {
          return;
        }
        if (type === 'box') {
          return new ProjectBoxAssetModel({ assets: this, doc });
        }
        throw new Error(`unsupported asset type '${type}'`);
      }
    })
  );

  dependencies = [this.query];

  serialized = $derived(serialized(this, ['path']));
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

  identifier = $derived(this.doc.data?.identifier);

  workspaces = new WorkspacesModel({
    project: this
  });

  assets = new ProjectAssetsModel({
    project: this
  });

  serialized = $derived(serialized(this, ['id', 'identifier']));

  dependencies = [this.doc, this.workspaces, this.assets];
}
