import { addObject, removeObject } from '$lib/utils/array';
import { getContext, setContext, untrack } from 'svelte';

export type TabOptions = {
  id: string;
  name: string;
};

export class Tab {
  options: TabOptions;

  constructor(options: TabOptions) {
    this.options = options;
  }

  id = $derived.by(() => this.options.id);
  name = $derived.by(() => this.options.name);
}

export type TabsContextOptions = {
  selected: string;
};

export class TabsContext {
  tabs = $state<Tab[]>([]);
  options: TabsContextOptions;

  constructor(options: TabsContextOptions) {
    this.options = options;
  }

  get selected() {
    return this.tabs.find((tab) => tab.id === this.options.selected);
  }

  tab(id: string) {
    return this.tabs.find((tab) => tab.id === id);
  }

  registerTab(options: TabOptions) {
    const tab = new Tab(options);
    untrack(() => {
      addObject(this.tabs, tab);
    });
    return () => removeObject(this.tabs, tab);
  }
}

export const setTabsContext = (context: TabsContext) => {
  setContext('tabs', context);
};

export const getTabsContext = () => {
  return getContext('tabs') as TabsContext;
};
