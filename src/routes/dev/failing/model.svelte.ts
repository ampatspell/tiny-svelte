export type ThingData = {
  name: string;
  position: {
    x: number;
    y: number
  };
}

export class Thing {
  data = $state<ThingData>();
  index = 0;

  get _next() {
    const index = this.index++;
    return {
      name: `Name #${index}`,
      position: {
        x: index * 5,
        y: index * 5
      }
    };
  }

  next() {
    this.data = this._next;
  }

  subscribe() {
    const id = setInterval(() => {
      this.data = this._next;
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }

  position = $derived(this.data?.position);

}

export class Things {
  content = $state<Thing[]>([]);

  subscribe() {
    const content: (() => void)[] = [];

    const id = setInterval(() => {
      const thing = new Thing();
      this.content.push(thing);
      content.push(thing.subscribe());

      this.content.map(e => e.position);
    }, 1000);

    return () => {
      content.forEach(cancel => cancel());
      clearInterval(id);
    };
  }
}
