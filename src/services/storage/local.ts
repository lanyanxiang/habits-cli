import { LocalStorage } from "node-localstorage";

const localStorage = new LocalStorage(__dirname);

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
