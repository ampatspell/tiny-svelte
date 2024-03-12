interface HasActivator {}

type ActivatorOptions = {
  deps?: HasActivator[];
  activate?: () => (() => void) | void;
};

class Activator {

  options: ActivatorOptions;
  listeners: number = 0;

  constructor(options: ActivatorOptions) {
    this.options= options;
  }

  get isActivated() {
    return this.listeners > 0;
  }

  activate() {
    this.listeners++;
    return () => {
      this.listeners--;
    };
  }

}

//

class Projects implements HasActivator {

  activator = new Activator({
    deps: [],
    activate: () => this.activate(),
  });

  activate() {

  }
}
