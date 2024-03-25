import type { LayoutLoad } from "../$types";
import { Thing } from "./model.svelte";

export const load: LayoutLoad = async () => {
  return {
    model: new Thing()
  };
}
