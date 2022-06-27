/*
 * Construction and display methods for table.
 */

import Table from "cli-table3";
import chalk from "chalk";

const create = (options?: Partial<Table.TableConstructorOptions>) => {
  return new Table({
    style: { border: [], head: ["cyan"] },
    wordWrap: true,
    ...options,
  });
};

const createCompact = (options?: Partial<Table.TableConstructorOptions>) => {
  return create({
    chars: {
      top: "",
      "top-mid": "",
      "top-left": "",
      "top-right": "",
      bottom: "",
      "bottom-mid": "",
      "bottom-left": "",
      "bottom-right": "",
      left: "",
      "left-mid": "",
      mid: "",
      "mid-mid": "",
      right: "",
      "right-mid": "",
      middle: " ",
    },
    ...options,
  });
};

interface PushValueUpdateRowOptions {
  disableEqValueWarning: boolean;
  shouldIncludeEqValue: boolean;
}

/**
 * Push one row of value update result to `table` with row title `rowTitle` and
 * show the value change from `oldValue` to `newValue`. If `oldValue` is equal
 * to `newValue`, print a warning to the console.
 */
const pushValueUpdateRow = (
  table: Table.Table,
  rowTitle: string,
  oldValue: any,
  newValue: any,
  options?: Partial<PushValueUpdateRowOptions>
) => {
  if (oldValue === newValue && !options?.disableEqValueWarning) {
    console.warn(
      `${chalk.bgYellow("WARN")} "${rowTitle}" already has value ${oldValue}.`
    );
  }
  if (oldValue !== newValue || options?.shouldIncludeEqValue) {
    table.push([`${rowTitle}:`, oldValue, "->", newValue]);
  }
};

const print = (table: Table.Table) => {
  console.log(table.toString());
};

export const table = { create, createCompact, pushValueUpdateRow, print };
