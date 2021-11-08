import {
  deletePassword,
  findCredentials,
  getPassword,
  setPassword,
} from "keytar";
import { generalConfig } from "../../config";

const get = async (key: string) => {
  return await getPassword(generalConfig.service, key);
};

/**
 * Return an object storing all registered key-value pairs.
 */
const getAll = async () => {
  const secrets: Record<string, any> = {};
  const credentials = await findCredentials(generalConfig.service);
  credentials.forEach(({ account, password }) => {
    secrets[account] = password;
  });
  return secrets;
};

const set = async (key: string, value: string) => {
  await setPassword(generalConfig.service, key, value);
};

const remove = async (key: string) => {
  return await deletePassword(generalConfig.service, key);
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
