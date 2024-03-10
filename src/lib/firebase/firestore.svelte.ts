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
import { activatable, type HasActivatable } from './activatable.svelte';

export type FirestoreModelOptions = {
  isPassive?: boolean;
};

export type DocumentOptions = {
  ref: DocumentReference | undefined;
} & FirestoreModelOptions;

type CancelSubscription = () => void;

export abstract class FirestoreModel<Options extends FirestoreModelOptions = FirestoreModelOptions> implements HasActivatable {
  options: Options;
  activatable = activatable();

  constructor(options: Options) {
    this.options = options;
    if (!this.options.isPassive) {
      this.activatable.onActivate(() => this.mount());
    }
  }

  get isPassive() {
    return this.options.isPassive;
  }

  protected abstract subscribe(): CancelSubscription | undefined;

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
} & FirestoreModelOptions;

abstract class BaseQuery<T extends DocumentData, O extends BaseQueryOptions> extends FirestoreModel<O> {
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

export class Query<T extends DocumentData = DocumentData> extends BaseQuery<T, BaseQueryOptions> {
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

export class QueryFirst<T extends DocumentData = DocumentData> extends BaseQuery<T, BaseQueryOptions> {
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
