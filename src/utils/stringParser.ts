/**
 * Make the first letter of `str` in upper case,
 * and the remainder of `str` lower cased.
 * @param str
 */
const capitalize = (str: string) => {
  if (!str.length) {
    return "";
  }
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert a camel cased string to a space separated string
 * in lower case.
 * @param str
 */
const camelToSpaceSeparated = (str: string) => {
  if (!str.length) {
    return "";
  }

  return (
    str[0].toLowerCase() +
    str.slice(1).replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)
  );
};

export const stringParser = {
  capitalize,
  camelToSpaceSeparated,
};
