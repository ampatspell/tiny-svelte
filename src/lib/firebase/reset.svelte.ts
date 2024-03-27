import type { AssetData } from '$lib/types/assets';
import type { Point } from '$lib/types/schema';
import {
  CollectionReference,
  DocumentReference,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from '@firebase/firestore';
import Color from 'color';

import { firebase } from './firebase.svelte';

const clearCollection = async (ref: CollectionReference) => {
  const snapshot = await getDocs(ref);
  await Promise.all(
    snapshot.docs.map(async (snapshot) => {
      await deleteDoc(snapshot.ref);
    }),
  );
};

const createWorkspace = async (workspacesRef: CollectionReference, identifier: string, assets: AssetWithPosition[]) => {
  const workspaceRef = doc(workspacesRef, identifier);
  const workspaceNodesRef = collection(workspaceRef, 'nodes');
  await clearCollection(workspaceNodesRef);

  await setDoc(workspaceRef, {
    identifier,
    pixel: 2,
  });

  await Promise.all([
    ...assets.map(async ({ position, asset }) => {
      const nodeRef = doc(workspaceNodesRef);
      await setDoc(nodeRef, {
        asset: asset.identifier,
        position: position,
        pixel: 4,
      });
    }),
    await setDoc(doc(workspaceNodesRef), { asset: 'missing', position: { x: 50, y: 30 }, pixel: 1 }),
  ]);
};

const createAssets = async (assetsRef: CollectionReference, assets: AssetWithPosition[]) => {
  await Promise.all(
    assets.map(async ({ asset }) => {
      const assetRef = doc(assetsRef);
      await setDoc(assetRef, asset);
    }),
  );
};

type AssetWithPosition = { position: Point; asset: AssetData };

const createProject = async (projectRef: DocumentReference) => {
  await setDoc(projectRef, {
    identifier: projectRef.id,
  });

  const assetsRef = collection(projectRef, 'assets');
  await clearCollection(assetsRef);

  const workspacesRef = collection(projectRef, 'workspaces');
  await clearCollection(assetsRef);

  const color = (name: string) => new Color(name).lighten(0.1).rgb().string();

  const assets: AssetWithPosition[] = [
    {
      position: { x: 3, y: 5 },
      asset: { type: 'box', identifier: 'red', size: { width: 8, height: 8 }, color: color('#ffafcc') },
    },
    {
      position: { x: 3, y: 45 },
      asset: { type: 'box', identifier: 'blue', size: { width: 8, height: 8 }, color: color('#a2d2ff') },
    },
    {
      position: { x: 3, y: 85 },
      asset: { type: 'sprite', identifier: 'heart', size: { width: 8, height: 8 }, pixels: Array(8 * 8).fill(0) },
    },
  ];

  await Promise.all([
    createWorkspace(workspacesRef, 'default', assets),
    createWorkspace(workspacesRef, 'another', assets),
    createAssets(assetsRef, assets),
  ]);
};

export const reset = async () => {
  const { firestore } = firebase;
  await createProject(doc(firestore, 'projects/hello'));
  await createProject(doc(firestore, 'projects/kitty'));
};
