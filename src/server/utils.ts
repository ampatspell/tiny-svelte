import { dirname as _dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const dirname = (importMetaUrl: string) => {
  return _dirname(fileURLToPath(importMetaUrl));
}
