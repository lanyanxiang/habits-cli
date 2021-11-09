import { Endpoints } from "../enums";
import { storage } from "../services";

export interface UserConfig {
  /** Endpoint to send requests to. */
  endpoint: Endpoints;
}

/**
 * A private memoization of previously loaded configurations.
 */
const configMemo: { [p: string]: any } = {};

const get = (key: keyof UserConfig & string) => {
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
};

export const userConfig = {
  get,
  set,
};
