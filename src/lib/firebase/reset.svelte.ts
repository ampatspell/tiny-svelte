import { CollectionReference, DocumentReference, collection, deleteDoc, doc, getDocs, setDoc } from '@firebase/firestore';
import { firebase } from './firebase.svelte';

const clearCollection = async (ref: CollectionReference) => {
  const snapshot = await getDocs(ref);
  await Promise.all(
    snapshot.docs.map(async (snapshot) => {
      await deleteDoc(snapshot.ref);
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

  const workspaceRef = doc(workspacesRef, 'default');
  const workspaceNodesRef = collection(workspaceRef, 'nodes');
  await clearCollection(workspaceNodesRef);

  await setDoc(workspaceRef, {
    identifier: 'default'
  });

  const boxes = [
    { identifier: 'red', position: { x: 3, y: 3 }, size: { width: 8, height: 8 }, color: 'red' },
    { identifier: 'green', position: { x: 30, y: 10 }, size: { width: 8, height: 8 }, color: 'green' }
  ];

  await Promise.all(
    boxes.map(async (box) => {
      const assetRef = doc(assetsRef);
      await setDoc(assetRef, {
        identifier: box.identifier,
        size: box.size,
        color: box.color
      });
      const nodeRef = doc(workspaceNodesRef);
      await setDoc(nodeRef, {
        identifier: box.identifier,
        position: box.position
      });
    })
  );
};

export const reset = async () => {
  const { firestore } = firebase;
  await createProject(doc(firestore, 'projects/hello'));
  await createProject(doc(firestore, 'projects/kitty'));
};
