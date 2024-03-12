import type { VoidCallback } from '$lib/firebase/firestore.svelte';
import type { EmptyObject } from '$lib/types';
import { sortedBy } from '$lib/utils/array';
import { useCurrentRoute } from '$lib/utils/page.svelte';
import type { ComponentType, SvelteComponent } from 'svelte';

export type Icon = ComponentType<SvelteComponent<EmptyObject>>;
export type ItemOptions = { icon: Icon; route?: string; onClick?: VoidCallback };

export class Item {
  icon: Icon;
  route?: string;
  onClick?: VoidCallback;
  items?: Items;

  constructor({ icon, route, onClick }: ItemOptions) {
    this.icon = icon;
    this.route = route;
    this.onClick = onClick;
  }

  get isCurrent() {
    return this.items?.current === this;
  }
}

export class Items {
  all: Item[];
  page = useCurrentRoute();

  constructor(items: Item[]) {
    this.all = items;
    items.forEach((item) => (item.items = this));
  }

  get current(): Item | undefined {
    const id = this.page.value?.route.id;
    if (!id) {
      return;
    }
    const matching = this.all.filter((item) => item.route && id?.startsWith(item.route));
    const [first] = sortedBy(matching, { value: (item) => item.route?.length, direction: 'desc' });
    return first;
  }
}

export const createItems = (items: ItemOptions[]) => {
  return new Items(items.map((item) => new Item(item)));
};
