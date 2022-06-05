import { storage } from "../services";
import { UserConfig } from "../types";

/**
 * A private memoization of previously loaded configurations.
 */
const configMemo: { [p: string]: any } = {};

const get = <T extends keyof UserConfig & string>(key: T): UserConfig[T] => {
  if (!(key in configMemo)) {
    /* Note that when a user-defined config is not found on disk,
     * a `null` value will be inserted into config memoization and
     * further lookups will be prevented by the"key in" syntax. */
    configMemo[key] = storage.local.get(key);
  }
  return configMemo[key];
};

const set = <T extends keyof UserConfig & string>(
  key: T,
  value: UserConfig[T]
) => {
  storage.local.set(key, value);
  const a = "";
};

export const userConfig = {
  get,
  set,
};
