import { removeObject } from '$lib/utils/array';
import { setGlobal } from '$lib/utils/set-global';
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

export type BaseOptions = {
  isPassive?: boolean;
};

export type DocumentOptions = {
  ref: DocumentReference | undefined;
} & BaseOptions;

type CancelSubscription = () => void;

export abstract class Base<O extends BaseOptions> {
  options: O;

  constructor(options: O) {
    this.options = options;
    if (!this.options.isPassive) {
      $effect(() => {
        this.mount();
        return () => this.unmount();
      });
    }
  }

  get isPassive() {
    return this.options.isPassive;
  }

  private cancel?: CancelSubscription;
  protected abstract subscribe(): CancelSubscription | undefined;

  private mount() {
    this.unmount();
    if (this.isPassive) {
      return;
    }
    this.cancel = this.subscribe();
  }

  private unmount() {
    const { cancel } = this;
    if (cancel) {
      cancel();
      this.cancel = undefined;
    }
  }

  abstract serialized: unknown;
}

export class Document<T extends Record<string, never>> extends Base<DocumentOptions> {
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
    this.isLoading = false;
    this.isLoaded = true;
    this.metadata = snapshot.metadata;
    this.exists = snapshot.exists();
    if (this.exists) {
      this.data = snapshot.data() as T;
    }
  }

  serialized = $derived.by(() => {
    const { id, path, isLoading, isLoaded, isError, error, metadata, exists, data } = this;
    return {
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
} & BaseOptions;

abstract class BaseQuery<T extends Record<string, never>, O extends BaseQueryOptions> extends Base<O> {
  constructor(options: O) {
    super(options);
  }

  protected abstract normalizeQuery(query: FirestoreQuery): FirestoreQuery;
  protected abstract clear(): void;

  protected subscribe() {
    const query = this.options.query;

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

export class Query<T extends Record<string, never>> extends BaseQuery<T, BaseQueryOptions> {
  content = $state<Document<T>[]>([]);

  protected normalizeQuery(query: FirestoreQuery): FirestoreQuery {
    return query;
  }

  clear(): void {
    this.content = [];
  }

  protected onSnapshot(querySnapshot: QuerySnapshot) {
    super.onSnapshot(querySnapshot);
    this.content = querySnapshot.docs.map((snapshot) => {
      return this.createDocument(snapshot);
    });
  }

  serialized = $derived.by(() => {
    const { isLoading, isLoaded, isError, error, metadata, content } = this;
    return {
      isLoading,
      isLoaded,
      isError,
      error,
      metadata,
      content: content.map((doc) => doc.serialized)
    };
  });
}

export class QueryFirst<T extends Record<string, never>> extends BaseQuery<T, BaseQueryOptions> {
  content = $state<Document<T>>();

  clear() {
    this.content = undefined;
  }

  protected normalizeQuery(provided: FirestoreQuery): FirestoreQuery {
    return query(provided, limit(1));
  }

  protected onSnapshot(querySnapshot: QuerySnapshot) {
    super.onSnapshot(querySnapshot);
    const [snapshot] = querySnapshot.docs;
    if (snapshot) {
      this.content = this.createDocument(snapshot);
    } else {
      this.content = undefined;
    }
  }

  serialized = $derived.by(() => {
    const { isLoading, isLoaded, isError, error, metadata, content } = this;
    return {
      isLoading,
      isLoaded,
      isError,
      error,
      metadata,
      content: content?.serialized
    };
  });
}
