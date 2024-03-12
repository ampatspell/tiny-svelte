import { removeObject } from '$lib/utils/array';
import { Query, QuerySnapshot, collection, onSnapshot } from '@firebase/firestore';
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

interface HasActivator {
  activator: Activator;
  description?: string;
}

abstract class Model implements HasActivator {
  activator: Activator;
  isActivated = $derived.by(() => this.activator.isActivated);

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

export type QueryImplOptions = {
  ref: Query | undefined;
};

export class QueryImpl extends Model {
  private options: QueryImplOptions;

  constructor(options: QueryImplOptions) {
    super();
    this.options = options;
  }

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

  activate() {
    const ref = this.ref;
    if (ref) {
      return onSnapshot(ref, { includeMetadataChanges: true }, (snapshot) => this.onSnapshot(snapshot));
    }
  }

  protected onSnapshot(querySnapshot: QuerySnapshot) {
    console.log('onSnapshot', querySnapshot);
  }

  get description() {
    return `<QueryImpl isActivated=${this.isActivated} path=${this.path}>`;
  }
}

//

export type QueryOptions = {
  ref: Query | undefined;
};

export class QueryAll extends Model {
  private options: QueryOptions;

  constructor(options: QueryOptions) {
    super();
    this.options = options;
  }

  private query = new QueryImpl(
    options({
      ref: getter(() => this.options.ref)
    })
  );

  dependencies = [this.query];

  activate() {
    console.log('query activate');
    return () => {
      console.log('query deactivate');
    };
  }

  get description() {
    return `<Query isActivated=${this.isActivated} impl=${this.query.description}>`;
  }
}

export class Projects extends Model {
  get ref() {
    return collection(firebase.firestore, 'projects');
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
    return `<Projects isActivated=${this.activator.isActivated}>`;
  }
}
