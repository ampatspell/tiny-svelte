import { action } from '$lib/utils/action';
import { orderBy, query, type OrderByDirection, type Query } from '@firebase/firestore';

export type OrderByOptions<T extends object> = {
  fields: (keyof T)[];
  initial?: keyof T;
};

export class OrderBy<T extends object> {
  private options: OrderByOptions<T>;
  private field = $state<keyof T>();

  direction = $state<OrderByDirection>('asc');
  directions: OrderByDirection[] = ['asc', 'desc'];

  constructor(options: OrderByOptions<T>) {
    this.options = options;
  }

  get fields() {
    return this.options.fields;
  }

  get initial() {
    return this.options.initial;
  }

  get selected() {
    return this.field ?? this.initial;
  }

  @action
  onField(field?: keyof T) {
    this.field = field;
  }

  @action
  onDirection(direction: OrderByDirection) {
    this.direction = direction;
  }

  apply(base: Query) {
    const { field, initial, direction } = this;
    const actual = field ?? initial;
    if (actual) {
      return query(base, orderBy(actual.toString(), direction));
    }
    return base;
  }
}
