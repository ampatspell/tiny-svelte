export type HasActivatable = {
  activatable: Activatable;
};

type OnActivate = () => (() => void) | undefined;

export class Activatable {
  private listeners = $state(0);
  children: HasActivatable[];

  constructor(children?: HasActivatable[]) {
    this.children = children ?? [];
  }

  get isActive() {
    return this.listeners > 0;
  }

  activate() {
    this.listeners++;
    const children = this.children.map((child) => child.activatable.activate());
    return () => {
      children.map((child) => child());
      this.listeners--;
    };
  }

  onActivate(fn: OnActivate) {
    $effect.pre(() => {
      if (this.isActive) {
        return fn();
      }
    });
  }
}

export const activatable = (...children: HasActivatable[]) => {
  return new Activatable(children);
};

const collect = (children: HasActivatable[]) => {
  const all: Activatable[] = [];
  children.forEach((child) => {
    all.push(child.activatable);
    all.push(...collect(child.activatable.children).filter((dep) => !all.includes(dep)));
  });
  return all;
};

export const activate = (...children: HasActivatable[]) => {
  const all = collect(children);
  $effect.pre(() => {
    const cancel = all.map((child) => child.activate());
    return () => {
      cancel.map((child) => child());
    };
  });
};
