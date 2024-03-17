import type { VoidCallback } from '$lib/types/types';

export type ItemProps = {
  isSelected?: boolean;
  route?: string;
  onClick?: VoidCallback;
};
