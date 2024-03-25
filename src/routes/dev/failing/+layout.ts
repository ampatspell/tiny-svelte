import type { LayoutLoad } from "../$types";
import { Things } from "./model.svelte";

export const load: LayoutLoad = async () => {
  return {
    model: new Things()
  };
}
