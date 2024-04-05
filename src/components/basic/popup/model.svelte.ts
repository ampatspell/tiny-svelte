import type { ComponentType, SvelteComponent } from 'svelte';

type Props = Record<string, unknown>;
type Component<T extends Props> = ComponentType<SvelteComponent<T>>;

export class PopupModel<T extends Props = Props> {
  component: Component<T>;
  props: T;

  constructor(component: Component<T>, props: T) {
    this.component = component;
    this.props = props;
  }

  close() {}
}

export class PopupsModel {
  all = $state<PopupModel[]>([]);

  open<T extends Props>(component: Component<T>, props: T) {
    const model = new PopupModel(component, props);
    this.all.push(model);
    return model;
  }
}

export const popups = new PopupsModel();
