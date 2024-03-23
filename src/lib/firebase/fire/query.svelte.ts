import {
  onSnapshot,
  type DocumentData,
  type Query,
  QuerySnapshot,
  QueryDocumentSnapshot,
  query,
  limit,
  getDocs
} from '@firebase/firestore';
import { FirebaseModel, type FirebaseModelOptions } from './firebase.svelte';
import type { VoidCallback } from '$lib/types/types';
import { Document } from './document.svelte';
import { untrack } from 'svelte';
import { stats } from './stats.svelte';
import { insertObjectAt, removeObjectAt } from '$lib/utils/array';
import { serialized } from '$lib/utils/object';

export type QueryBaseOptions = {
  ref: Query | undefined;
} & FirebaseModelOptions;

export class QueryBase<
  T extends DocumentData = DocumentData,
  O extends QueryBaseOptions = QueryBaseOptions
> extends FirebaseModel<O> {
  ref = $derived(this.options.ref);

  path = $derived.by(() => {
    const { ref } = this;
    if (ref) {
      const path = (ref as unknown as { path: string | undefined }).path;
      return path;
    }
  });

  private needsContentReset = false;
  _content = $state<Document<T>[]>([]);

  private _createDocument(snapshot: QueryDocumentSnapshot) {
    const doc = new Document<T>({ ref: snapshot.ref, isPassive: true });
    doc._onSnapshot(snapshot);
    return doc;
  }

  _onWillLoad(subscribe: boolean) {
    super._onWillLoad(subscribe);
    if (subscribe) {
      this.needsContentReset = true;
    } else {
      this._content = [];
    }
  }

  _maybeResetContent() {
    const content = this._content;
    if (this.needsContentReset) {
      this._content = [];
      this.needsContentReset = false;
    }
    return content;
  }

  _subscribeActive() {
    return $effect.root(() => {
      $effect.pre(() => {
        const ref = this.ref;

        untrack(() => this._onWillLoad(!!ref));

        let cancel: VoidCallback | undefined;
        if (ref) {
          const normalized = this._normalizeRef(ref);
          const snapshot = onSnapshot(
            normalized,
            { includeMetadataChanges: true },
            (snapshot) => {
              this._onSnapshot(snapshot);
            },
            (error) => {
              this._onError(error);
            }
          );
          const listening = stats._registerListening(this);
          cancel = () => {
            snapshot();
            listening();
          };
        }

        return () => {
          cancel?.();
        };
      });
    });
  }

  _normalizeRef(ref: Query) {
    return ref;
  }

  _onSnapshot(querySnapshot: QuerySnapshot) {
    const previous = this._maybeResetContent();
    const findOrCreate = (snapshot: QueryDocumentSnapshot) => {
      let doc = previous.find((doc) => doc.path === snapshot.ref.path);
      if (!doc) {
        doc = this._createDocument(snapshot);
      }
      return doc;
    };

    const current = this._content;

    querySnapshot.docChanges().forEach(({ type, oldIndex, newIndex, doc: snapshot }) => {
      if (type === 'added') {
        const doc = findOrCreate(snapshot);
        insertObjectAt(current, newIndex, doc);
      } else if (type === 'modified') {
        const doc = current[oldIndex];
        doc._onSnapshot(snapshot);
        if (oldIndex !== newIndex) {
          removeObjectAt(current, oldIndex);
          insertObjectAt(current, newIndex, doc);
        }
      } else if (type === 'removed') {
        const doc = current[oldIndex];
        doc._onSnapshot(snapshot);
        removeObjectAt(current, oldIndex);
      }
    });

    this._onDidLoad(querySnapshot.metadata);
  }

  async load() {
    // todo queue and parallel subscription + load
    this.isLoading = true;
    try {
      const ref = this.ref;
      if (!ref) {
        return;
      }
      const normalized = this._normalizeRef(ref);
      const snapshot = await getDocs(normalized);
      this.needsContentReset = true;
      this._onSnapshot(snapshot);
    } catch (err) {
      this._onError(err);
    } finally {
      this.isLoading = false;
    }
  }
}

export type QueryAllOptions = QueryBaseOptions;

export class QueryAll<T extends DocumentData = DocumentData> extends QueryBase<T, QueryAllOptions> {
  content = $derived(this._content);
  size = $derived(this.content.length);

  serialized = $derived.by(() => serialized(this, ['path', 'isLoading', 'isLoaded', 'isError', 'error', 'size']));
}

export type QueryFirstOptions = QueryBaseOptions;

export class QueryFirst<T extends DocumentData = DocumentData> extends QueryBase<T, QueryFirstOptions> {
  content = $derived(this._content[0]);

  exists = $derived.by(() => {
    if (this.isLoaded) {
      return !!this.content;
    }
  });

  _normalizeRef(ref: Query) {
    return query(ref, limit(1));
  }

  serialized = $derived.by(() => serialized(this, ['path', 'isLoading', 'isLoaded', 'isError', 'error', 'exists']));
}
