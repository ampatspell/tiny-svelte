import type { Point } from '$lib/types/schema';
import { addPoints } from '$lib/utils/math';
import type { ComponentType, SvelteComponent } from 'svelte';

type Placement = 'bottom-left';

type RelativeToOptions = {
  element: HTMLElement;
  placement: Placement;
  offset: Point;
};

export class RelativeTo {
  element: HTMLElement;
  placement: Placement;
  offset: Point;

  constructor({ element, placement, offset }: RelativeToOptions) {
    this.element = element;
    this.placement = placement;
    this.offset = offset;
  }

  get position() {
    const { element, placement, offset } = this;
    const { left, bottom } = element.getBoundingClientRect();
    const withOffset = (position: Point) => addPoints(position, offset);
    if (placement === 'bottom-left') {
      return withOffset({
        x: left,
        y: bottom,
      });
    } else {
      throw new Error(`unsupported placement '${placement}'`);
    }
  }
}

const createRelativeTo = ({ element, placement, offset }: Partial<RelativeToOptions> = {}) => {
  if (!element) {
    return;
  }
  return new RelativeTo({
    element,
    placement: placement ?? 'bottom-left',
    offset: offset ?? { x: 0, y: 0 },
  });
};

type Props = Record<string, unknown>;
type Component<T extends Props> = ComponentType<SvelteComponent<T>>;

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

type OpenOptions<T extends Props> = {
  component: Component<T>;
  props: T;
  relativeTo?: Partial<RelativeToOptions>;
};

export class PopupsModel {
  all = $state<PopupModel[]>([]);

  open<T extends Props>({ component, props, relativeTo }: OpenOptions<T>) {
    const model = new PopupModel(component, props, createRelativeTo(relativeTo));
    this.all.push(model);
    return model;
  }
}

export const popups = new PopupsModel();
