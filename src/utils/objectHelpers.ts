/**
 * Return a **new** object containing only `keys` from `obj`.
 * That is, the **new** object returned will be a **subset** of the
 * original object `obj`.
 * @param obj Object to parse.
 * @param keys Keys in `obj` to include in the newly returned object.
 */
export const selectKeys = <T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Record<K, T[K]> => {
  return keys.reduce<Record<K, T[K]>>((accumulator, key) => {
    accumulator[key] = obj[key];
    return accumulator;
  }, {} as Record<K, T[K]>);
};
