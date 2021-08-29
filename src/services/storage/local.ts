import path from "path";
import { LocalStorage } from "node-localstorage";

const storageDir = path.join(
  path.dirname(
    require.main?.filename || process.mainModule?.filename || __dirname
  ),
  "storage"
);
const localStorage = new LocalStorage(storageDir);

const get = (key: string) => {
  return localStorage.getItem(key);
};

const set = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

const remove = (key: string) => {
  localStorage.removeItem(key);
};

export const local = {
  get,
  set,
  remove,
};
