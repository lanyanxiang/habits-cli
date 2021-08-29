import {
  deletePassword,
  findCredentials,
  getPassword,
  setPassword,
} from "keytar";
import { config } from "../../config";

const get = async (key: string) => {
  return await getPassword(config.service, key);
};

/**
 * Return an object storing all registered key-value pairs.
 */
const getAll = async () => {
  const secrets: Record<string, any> = {};
  const credentials = await findCredentials(config.service);
  credentials.forEach(({ account, password }) => {
    secrets[account] = password;
  });
  return secrets;
};

const set = async (key: string, value: string) => {
  await setPassword(config.service, key, value);
};

const remove = async (key: string) => {
  return await deletePassword(config.service, key);
};

/**
 * Manages secret storage, using OS' key/password management services.
 * For example, this will use keychain on Mac OS.
 */
export const secrets = {
  get,
  getAll,
  set,
  remove,
};
