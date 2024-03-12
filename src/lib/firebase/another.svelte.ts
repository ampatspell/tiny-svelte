import { removeObject } from '$lib/utils/array';
import { FirestoreError, Query, QuerySnapshot, collection, onSnapshot, orderBy, query } from '@firebase/firestore';
import { untrack } from 'svelte';
import { firebase } from './firebase.svelte';
import { getter, options } from '$lib/utils/args';

export interface Activators {
  all: HasActivator[];
}

export class ActivatorsImpl implements Activators {
  private _all = $state<HasActivator[]>([]);
  all = $derived(this._all);

  register(model: HasActivator) {
    this.all.push(model);
    return () => {
      removeObject(this.all, model);
    };
  }
}

const _activators = new ActivatorsImpl();
export const activators: Activators = _activators;

export interface HasActivator {
  activator: Activator;
  description?: string;
}

abstract class Model implements HasActivator {
  activator: Activator;
  isActivated = $derived.by(() => this.activator.isActivated);

  get isActivatedUntracked() {
    return untrack(() => this.isActivated);
  }

  constructor() {
    this.activator = new Activator({
      owner: () => this,
      activate: () => this.activate(),
      dependencies: () => this.dependencies
    });
  }

  dependencies: HasActivator[] = [];
  activate() {}
}

type OnActivateResult = (() => void) | void;
type OnActivate = () => OnActivateResult;

type ActivatorOptions = {
  owner: () => HasActivator;
  dependencies?: () => HasActivator[];
  activate?: OnActivate;
};

class Activator {
  private options: ActivatorOptions;
  private listeners = $state(0);

  isActivated = $derived(this.listeners > 0);

  constructor(options: ActivatorOptions) {
    this.options = options;
  }

  get dependencies() {
    return this.options.dependencies?.() ?? [];
  }

  get owner() {
    return this.options.owner();
  }

  private cancel: OnActivateResult | undefined;

  private onIncrement() {
    this.listeners++;
    if (this.listeners === 1) {
      const registration = _activators.register(this.owner);
      const activation = this.options.activate?.();
      this.cancel = () => {
        registration();
        activation?.();
      };
    }
  }

  private onDecrement() {
    this.listeners--;
    if (this.listeners === 0) {
      const cancel = this.cancel;
      if (cancel) {
        cancel();
        this.cancel = undefined;
      }
    }
  }

  increment() {
    this.onIncrement();
    const dependencies = this.dependencies.map((dep) => dep.activator.increment());
    return () => {
      dependencies.forEach((dep) => dep());
      this.onDecrement();
    };
  }
}

export const activate = (model: HasActivator) => {
  $effect(() => {
    return untrack(() => {
      return model.activator.increment();
    });
  });
};

export abstract class Base extends Model {
  abstract subscribeDependencies: unknown[];
  private cancel?: () => void;

  constructor() {
    super();
    $effect(() => this.refresh());
  }

  abstract subscribe(): (() => void) | undefined;

  _subscribe() {
    this.cancel = this.subscribe();
  }

  _unsubscribe() {
    const cancel = this.cancel;
    if (cancel) {
      cancel();
      this.cancel = undefined;
    }
  }

  refresh() {
    this.subscribeDependencies;
    if (this.isActivatedUntracked) {
      this._unsubscribe();
      this._subscribe();
    }
  }

  activate() {
    this._subscribe();
    return () => {
      this._unsubscribe();
    };
  }
}

export type BaseQueryOptions = {
  ref: Query | undefined;
};

export class BaseQuery<O extends BaseQueryOptions> extends Base {
  private options: O;

  constructor(options: O) {
    super();
    this.options = options;
  }

  isLoading = $state(false);
  isLoaded = $state(false);
  error = $state<unknown>();
  isError = $derived.by(() => !!this.error);

  get ref() {
    return this.options.ref;
  }

  get path() {
    const { ref } = this;
    if (ref) {
      const path = (ref as unknown as { path: string | undefined }).path;
      return path;
    }
  }

  get subscribeDependencies() {
    return [this.ref];
  }

  subscribe() {
    const ref = this.ref;

    this.error = undefined;
    this.isLoading = true;
    if (!ref) {
      this.isLoaded = false;
    }

    if (ref) {
      return onSnapshot(
        ref,
        { includeMetadataChanges: true },
        (snapshot) => this.onSnapshot(snapshot),
        (error) => this.onError(error)
      );
    }
  }

  onError(error: FirestoreError) {
    this.isLoading = false;
    this.error = error;
  }

  protected onSnapshot(querySnapshot: QuerySnapshot) {
    this.isLoading = false;
    this.isLoaded = true;
    console.log('onSnapshot', querySnapshot);
  }
}

//

export type QueryAllOptions = BaseQueryOptions;

export class QueryAll extends BaseQuery<QueryAllOptions> {
  constructor(options: QueryAllOptions) {
    super(options);
  }

  get description() {
    return `<Query path=${this.path} isLoading=${this.isLoading} isLoaded=${this.isLoaded} active=${this.isActivated}>`;
  }
}

export class Projects extends Model {
  order = $state<'asc' | 'desc'>('asc');

  toggleOrder() {
    this.order = this.order === 'asc' ? 'desc' : 'asc';
  }

  get ref() {
    return query(collection(firebase.firestore, 'projects'), orderBy('identifier', this.order));
  }

  query = new QueryAll(
    options({
      ref: getter(() => this.ref)
    })
  );

  dependencies = [this.query];

  activate() {
    console.log('projects activate');
    return () => {
      console.log('projects deactivate');
    };
  }

  get description() {
    return `<Projects active=${this.activator.isActivated}>`;
  }
}
