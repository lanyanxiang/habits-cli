export interface ValueUpdateRowOptions {
  /**
   * When set to true, no warning message will be printed on the console
   * if the old value is equal to the new value. Defaults to false.
   */
  disableEqValueWarning: boolean;
  /**
   * When set to true, a row will still be added to the table when the old
   * value is equal to the new value. Defaults to false.
   */
  shouldIncludeEqValue: boolean;
}
