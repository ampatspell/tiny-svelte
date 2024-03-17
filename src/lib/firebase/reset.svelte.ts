import { CollectionReference, DocumentReference, collection, deleteDoc, doc, getDocs, setDoc } from '@firebase/firestore';
import { firebase } from './firebase.svelte';
import type { Point, Size } from '$lib/types/schema';

type Box = {
  identifier: string;
  position: Point;
  size: Size;
  color: string;
};

const clearCollection = async (ref: CollectionReference) => {
  const snapshot = await getDocs(ref);
  await Promise.all(
    snapshot.docs.map(async (snapshot) => {
      await deleteDoc(snapshot.ref);
    })
  );
};

const createWorkspace = async (workspacesRef: CollectionReference, identifier: string, boxes: Box[]) => {
  const workspaceRef = doc(workspacesRef, identifier);
  const workspaceNodesRef = collection(workspaceRef, 'nodes');
  await clearCollection(workspaceNodesRef);

  await setDoc(workspaceRef, {
    identifier
  });

  await Promise.all([
    ...boxes.map(async (box) => {
      const nodeRef = doc(workspaceNodesRef);
      await setDoc(nodeRef, {
        asset: box.identifier,
        position: box.position
      });
    }),
    await setDoc(doc(workspaceNodesRef), { asset: 'missing', position: { x: 50, y: 30 } })
  ]);
};

const createAssets = async (assetsRef: CollectionReference, boxes: Box[]) => {
  await Promise.all(
    boxes.map(async (box) => {
      const assetRef = doc(assetsRef);
      await setDoc(assetRef, {
        type: 'box',
        identifier: box.identifier,
        size: box.size,
        color: box.color
      });
    })
  );
};

const createProject = async (projectRef: DocumentReference) => {
  await setDoc(projectRef, {
    identifier: projectRef.id
  });

  const assetsRef = collection(projectRef, 'assets');
  await clearCollection(assetsRef);

  const workspacesRef = collection(projectRef, 'workspaces');
  await clearCollection(assetsRef);

  const boxes = [
    { identifier: 'red', position: { x: 3, y: 3 }, size: { width: 8, height: 8 }, color: 'red' },
    { identifier: 'green', position: { x: 30, y: 10 }, size: { width: 8, height: 8 }, color: 'green' }
  ];

  await Promise.all([
    createWorkspace(workspacesRef, 'default', boxes),
    createWorkspace(workspacesRef, 'another', boxes),
    createAssets(assetsRef, boxes)
  ]);
};

export const reset = async () => {
  const { firestore } = firebase;
  await createProject(doc(firestore, 'projects/hello'));
  await createProject(doc(firestore, 'projects/kitty'));
};
