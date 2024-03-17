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
  _doc = $derived(this.options.doc);
  id = $derived(this._doc.id);
  path = $derived(this._doc.path);

  position = $derived(this._doc.data!.position);
  assetIdentifier = $derived(this._doc.data!.asset);

  asset = $derived(this.options.asset(this.assetIdentifier));

  serialized = $derived(serialized(this, ['id', 'assetIdentifier', 'asset']));
}

export type WorkspaceNodesModelOptions = {
  workspace: WorkspaceModel;
};

export class WorkspaceNodesModel extends ActivatableModel<WorkspaceNodesModelOptions> {
  workspace = $derived(this.options.workspace);
  project = $derived(this.workspace.project);
  assets = $derived(this.project.assets);

  ref = $derived(collection(this.workspace.ref, 'nodes'));
  path = $derived(this.ref.path);

  _query = new QueryAll<WorkspaceNodeData>(
    options({
      ref: getter(() => this.ref)
    })
  );

  _all = new Models(
    options({
      source: getter(() => this._query.content),
      model: (doc: Document<WorkspaceNodeData>) =>
        new WorkspaceNodeModel({
          nodes: this,
          doc,
          asset: (identifier) => this.assets.assetByIdentifier(identifier)
        })
    })
  );

  all = $derived(this._all.content);

  dependencies = [this._query, this._all];

  serialized = $derived(serialized(this, ['path']));
}

export type WorkspaceModelOptions = {
  project: ProjectModel;
  id: string;
};

export class WorkspaceModel extends ActivatableModel<WorkspaceModelOptions> {
  project = $derived(this.options.project);

  id = $derived(this.options.id);
  ref = $derived(doc(collection(this.project.ref, 'workspaces'), this.id));
  path = $derived(this.ref.path);

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
  project = $derived(this.options.project);
  ref = $derived(collection(this.project.ref, 'workspaces'));
  path = $derived(this.ref.path);

  _query = new QueryAll<WorkspaceData>(
    options({
      ref: getter(() => this.ref)
    })
  );

  serialized = $derived(serialized(this, ['path']));

  dependencies = [this._query];
}

//

export type ProjectAssetModelOptions<D extends DocumentData> = {
  assets: ProjectAssetsModel;
  doc: Document<D>;
};

export class ProjectAssetModel<D extends DocumentData = DocumentData> extends Model<ProjectAssetModelOptions<D>> {
  _doc = $derived(this.options.doc);
  _data = $derived(this._doc.data);

  id = $derived(this._doc.id);
  path = $derived(this._doc.path);

  identifier = $derived(this._data?.identifier);

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
  id = $derived(this.ref.id);
  path = $derived(this.ref.path);

  _query = new QueryAll<AssetData>(
    options({
      ref: getter(() => this.ref)
    })
  );

  _all = new Models<Document<AssetData>, ProjectAssetModel<AssetData>>(
    options({
      source: getter(() => this._query.content),
      model: (doc: Document<AssetData>) => {
        const type = doc.data?.type;
        if (type) {
          if (type === 'box') {
            return new ProjectBoxAssetModel({ assets: this, doc });
          }
          throw new Error(`unsupported asset type '${type}'`);
        }
      }
    })
  );

  all = $derived(this._all.content);

  assetByIdentifier(identifier: string) {
    return this.all.find((asset) => asset?.identifier === identifier);
  }

  dependencies = [this._query, this._all];

  serialized = $derived(serialized(this, ['id']));
}

export type ProjectModelOptions = {
  id: string;
};

export class ProjectModel extends ActivatableModel<ProjectModelOptions> {
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
}
