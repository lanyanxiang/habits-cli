export const selectKeys = <T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Record<K, T[K]> => {
  return keys.reduce<Record<K, T[K]>>((accumulator, key) => {
    accumulator[key] = obj[key];
    return accumulator;
  }, {} as Record<K, T[K]>);
};
