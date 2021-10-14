/**
 * Return a **new** object containing only `keys` from `obj`.
 * That is, the **new** object returned will be a **subset** of the
 * original object `obj`.
 * @param obj Object to parse.
 * @param keys Keys in `obj` to include in the newly returned object.
 */
const selectKeys = <T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> => {
  return keys.reduce<Pick<T, K>>((accumulator, key) => {
    accumulator[key] = obj[key];
    return accumulator;
  }, {} as Pick<T, K>);
};

const excludeKeys = <T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Exclude<T, K> => {
  const objKeysExcluded = { ...obj };
  keys.forEach((key) => {
    delete objKeysExcluded[key];
  });
  return objKeysExcluded as Exclude<T, K>;
};

export const objectParser = {
  selectKeys,
};
