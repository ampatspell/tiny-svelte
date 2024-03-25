export type ThingData = {
  name: string;
  position: {
    x: number;
    y: number
  };
}

export class Thing {
  data = $state<ThingData[]>([]);
  index = 0;

  subscribe() {
    return $effect.root(() => {
      $effect.pre(() => {
        const id = setInterval(() => {
          const index = this.index++;
          const data = {
            name: `Name #${index}`,
            position: {
              x: index * 5,
              y: index * 5
            }
          };
          if(this.data.length === 0) {
            this.data.push(data);
          } else {
            this.data[0] = data;
          }
          console.log(this.data);
        }, 1000);
        return () => {
          clearInterval(id);
        }
      });
    });
  }
}
