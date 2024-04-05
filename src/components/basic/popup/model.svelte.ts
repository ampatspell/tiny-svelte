import type { Point } from '$lib/types/schema';
import type { ComponentType, SvelteComponent } from 'svelte';

type Placement = 'bottom-left';

type Props = Record<string, unknown>;
type Component<T extends Props> = ComponentType<SvelteComponent<T>>;

export class RelativeTo {
  element: HTMLElement;
  placement: Placement;
  offset: Point;

  constructor(element: HTMLElement, placement: Placement, offset: Point) {
    this.element = element;
    this.placement = placement;
    this.offset = offset;
  }
}

export class PopupModel<T extends Props = Props> {
  component: Component<T>;
  props: T;
  relativeTo?: RelativeTo;

  constructor(component: Component<T>, props: T, relativeTo?: RelativeTo) {
    this.component = component;
    this.props = props;
    this.relativeTo = relativeTo;
  }

  close() {}
}

export class PopupsModel {
  all = $state<PopupModel[]>([]);

  _resolveRelativeTo(element?: HTMLElement, placement?: Placement, offset?: Point) {
    if (!element) {
      return;
    }
    return new RelativeTo(element, placement ?? 'bottom-left', offset ?? { x: 0, y: 0 });
  }

  open<T extends Props>(
    component: Component<T>,
    props: T,
    relativeTo?: HTMLElement,
    placement?: Placement,
    offset?: Point,
  ) {
    const relative = this._resolveRelativeTo(relativeTo, placement, offset);
    const model = new PopupModel(component, props, relative);
    this.all.push(model);
    return model;
  }
}

export const popups = new PopupsModel();
