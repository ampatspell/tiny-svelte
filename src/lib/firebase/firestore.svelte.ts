import {
  DocumentReference,
  DocumentSnapshot,
  Query as FirestoreQuery,
  QuerySnapshot,
  SnapshotMetadata,
  onSnapshot,
  QueryDocumentSnapshot,
  limit,
  query
} from '@firebase/firestore';
import { firebase } from './firebase.svelte';
import { untrack } from 'svelte';

export type FirestoreModelOptions = {
  isPassive?: boolean;
};

export type DocumentOptions = {
  ref: DocumentReference | undefined;
} & FirestoreModelOptions;

export abstract class FirestoreModel<Options extends FirestoreModelOptions = FirestoreModelOptions> {
  options: Options;

  constructor(options: Options) {
    this.options = options;
    if (!this.options.isPassive) {
      $effect(() => {
        return this.mount();
      });
    }
  }

  get isPassive() {
    return this.options.isPassive;
  }

  protected abstract subscribe(): (() => void) | undefined;

  private mount() {
    const subscription = this.subscribe();
    if (!subscription) {
      return;
    }
    const registration = untrack(() => firebase.subscribed.register(this));
    return () => {
      registration();
      subscription();
    };
  }

  abstract serialized: { [key: string]: unknown };
}

export type DocumentData = Record<string, never>;

export class Document<T extends DocumentData = DocumentData> extends FirestoreModel<DocumentOptions> {
  constructor(options: DocumentOptions) {
    super(options);
  }

  get ref() {
    return this.options.ref;
  }

  get id() {
    return this.ref?.id;
  }

  get path() {
    return this.ref?.path;
  }

  protected subscribe() {
    const ref = this.ref;

    this.metadata = undefined;
    this.exists = undefined;
    this.data = undefined;
    this.error = undefined;
    this.isLoaded = false;

    if (!ref) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    return onSnapshot(ref, { includeMetadataChanges: true }, (snapshot) => this.onSnapshot(snapshot));
  }

  metadata = $state<SnapshotMetadata>();
  exists = $state<boolean>();
  data = $state<T>();
  error = $state<unknown>();

  isLoading = $state(false);
  isLoaded = $state(false);
  isError = $derived(!!this.error);

  onSnapshot(snapshot: DocumentSnapshot) {
    this.metadata = snapshot.metadata;
    this.exists = snapshot.exists();
    if (this.exists) {
      this.data = snapshot.data() as T;
    }
    this.isLoading = false;
    this.isLoaded = true;
  }

  serialized = $derived.by(() => {
    const { id, path, isLoading, isLoaded, isError, error, metadata, exists, data } = this;
    return {
      type: 'document',
      id,
      path,
      isLoading,
      isLoaded,
      isError,
      error,
      metadata,
      exists,
      data
    };
  });
}

export type BaseQueryOptions = {
  query: FirestoreQuery | undefined;
} & FirestoreModelOptions;

abstract class BaseQuery<T extends DocumentData, O extends BaseQueryOptions> extends FirestoreModel<O> {
  constructor(options: O) {
    super(options);
  }

  protected abstract normalizeQuery(query: FirestoreQuery): FirestoreQuery;
  protected abstract clear(): void;

  get query() {
    return this.options.query;
  }

  get path() {
    const { query } = this;
    if (query) {
      const path = (query as unknown as { path: string | undefined }).path;
      return path;
    }
  }

  protected subscribe() {
    const query = this.query;

    this.metadata = undefined;
    this.error = undefined;
    this.isLoaded = false;

    if (!query) {
      this.clear();
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    const normalized = this.normalizeQuery(query);
    return onSnapshot(normalized, (snapshot) => this.onSnapshot(snapshot));
  }

  metadata = $state<SnapshotMetadata>();
  error = $state<unknown>();

  isLoading = $state(false);
  isLoaded = $state(false);
  isError = $derived(!!this.error);

  protected onSnapshot(snapshot: QuerySnapshot) {
    this.isLoading = false;
    this.isLoaded = true;
    this.metadata = snapshot.metadata;
  }

  protected createDocument(snapshot: QueryDocumentSnapshot) {
    const doc = new Document<T>({ isPassive: true, ref: snapshot.ref });
    doc.onSnapshot(snapshot);
    return doc;
  }
}

export class Query<T extends DocumentData = DocumentData> extends BaseQuery<T, BaseQueryOptions> {
  content = $state<Document<T>[]>([]);

  protected normalizeQuery(query: FirestoreQuery): FirestoreQuery {
    return query;
  }

  clear(): void {
    this.content = [];
  }

  protected onSnapshot(querySnapshot: QuerySnapshot) {
    this.content = querySnapshot.docs.map((snapshot) => {
      return this.createDocument(snapshot);
    });
    super.onSnapshot(querySnapshot);
  }

  serialized = $derived.by(() => {
    const { path, isLoading, isLoaded, isError, error, metadata, content } = this;
    return {
      type: 'quey',
      path,
      isLoading,
      isLoaded,
      isError,
      error,
      metadata,
      content: content.map((doc) => doc.serialized)
    };
  });
}

export class QueryFirst<T extends DocumentData = DocumentData> extends BaseQuery<T, BaseQueryOptions> {
  content = $state<Document<T>>();

  clear() {
    this.content = undefined;
  }

  protected normalizeQuery(provided: FirestoreQuery): FirestoreQuery {
    return query(provided, limit(1));
  }

  protected onSnapshot(querySnapshot: QuerySnapshot) {
    const [snapshot] = querySnapshot.docs;
    if (snapshot) {
      this.content = this.createDocument(snapshot);
    } else {
      this.content = undefined;
    }
    super.onSnapshot(querySnapshot);
  }

  serialized = $derived.by(() => {
    const { path, isLoading, isLoaded, isError, error, metadata, content } = this;
    return {
      type: 'query-first',
      path,
      isLoading,
      isLoaded,
      isError,
      error,
      metadata,
      content: content?.serialized
    };
  });
}
