/**
 * Utilities relating to string conversions.
 */
export class StringParser {
  /**
   * Make the first letter of `str` in upper case,
   * and the remainder of `str` lower cased.
   * @param str
   */
  static capitalize = (str: string) => {
    if (!str.length) {
      return "";
    }
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  };
}
