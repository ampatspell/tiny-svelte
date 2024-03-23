import {
  getDocFromCache,
  type DocumentReference,
  getDocFromServer,
  getDoc,
  type DocumentData,
  onSnapshot,
  DocumentSnapshot,
  deleteDoc,
  setDoc
} from '@firebase/firestore';
import { FirebaseModel, type FirebaseModelOptions } from './firebase.svelte';
import type { OptionsInput } from '$lib/utils/args';
import type { VoidCallback } from '$lib/types/types';
import { untrack } from 'svelte';
import { stats } from './stats.svelte';
import { Debounce } from './debounce.svelte';
import { serialized } from '$lib/utils/object';
import { browser } from '$app/environment';

const createToken = () => {
  if (browser) {
    return window.crypto.randomUUID().replaceAll('-', '');
  }
  return null;
};

export const TOKEN = '_token';

export type DocumentLoadSource = 'cached' | 'remote' | undefined;

const getDocBySource = (ref: DocumentReference, source: DocumentLoadSource) => {
  if (source === 'cached') {
    return getDocFromCache(ref);
  } else if (source === 'remote') {
    return getDocFromServer(ref);
  } else if (source === undefined) {
    return getDoc(ref);
  }
  throw new Error(`unsupported source ${source}`);
};

export type DocumentLoadOptions = {
  force?: boolean;
  source?: DocumentLoadSource;
};

export type DocumentOptions = {
  ref?: DocumentReference;
} & FirebaseModelOptions;

export class Document<T extends DocumentData = DocumentData> extends FirebaseModel<DocumentOptions> {
  token: string | null;

  constructor(options: OptionsInput<DocumentOptions>) {
    super(options);
    this.token = createToken();
  }

  data = $state<T>();
  exists = $state<boolean>();
  isSaving = $state(false);

  ref = $derived(this.options.ref);
  id = $derived(this.ref?.id);
  path = $derived(this.ref?.path);

  _subscribeActive() {
    return $effect.root(() => {
      $effect.pre(() => {
        const ref = this.ref;

        untrack(() => this.onWillLoad(!!ref));

        let cancel: VoidCallback | undefined;
        if (ref) {
          const snapshot = onSnapshot(ref, { includeMetadataChanges: true }, (snapshot) => this.onSnapshot(snapshot));
          // TODO: why this cast?
          const listening = stats._registerListening(this as unknown as FirebaseModel);
          cancel = () => {
            snapshot();
            listening();
          };
        }

        return () => {
          // TODO: this.debounce.force() needs last ref
          this.debounce.cancel();
          cancel?.();
        };
      });
    });
  }

  onSnapshot(snapshot: DocumentSnapshot) {
    const exists = snapshot.exists();
    // TODO: diff deep-equal
    const next = snapshot.data({ serverTimestamps: 'estimate' }) as T;
    if (next[TOKEN] !== this.token) {
      this.data = next;
    }
    this.exists = exists;
    this.onDidLoad(snapshot.metadata);
  }

  async load(options: DocumentLoadOptions = {}): Promise<void> {
    // TODO: maybe check for options.source and decide if loaded
    if (this.isLoaded && !options.force) {
      return;
    }
    const ref = this.ref;
    if (!ref) {
      return;
    }
    this.isLoading = true;
    try {
      const snapshot = await getDocBySource(ref, options.source);
      this.onSnapshot(snapshot);
    } catch (err) {
      this.onError(err);
    } finally {
      this.isLoading = false;
    }
  }

  async save(): Promise<void> {
    const ref = this.ref;
    if (ref) {
      const data = Object.assign({}, this.data, { [TOKEN]: this.token });
      // TODO: queue
      // TODO: proper merge
      this.isSaving = true;
      try {
        await setDoc(ref, data, { merge: true });
      } catch(err) {
        this.onError(err);
      } finally {
        this.isSaving = false;
      }
    }
  }

  async delete(): Promise<void> {
    const ref = this.ref;
    if (ref) {
      this.debounce.cancel();
      // TODO: queue
      try {
        await deleteDoc(ref);
        this.exists = false;
      } catch(err) {
        this.onError(err);
      } finally {
        this.isSaving = false;
      }
    }
  }

  debounce = new Debounce({
    delay: 300,
    commit: () => this.save()
  });

  scheduleSave() {
    // TODO: do a queue
    this.debounce.schedule();
  }

  serialized = $derived(serialized(this, ['path', 'isLoading', 'isLoaded', 'error']));
}
