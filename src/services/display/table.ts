/*
 * Construction and display methods for table.
 */

import Table from "cli-table3";

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

const print = (table: Table.Table) => {
  console.log(table.toString());
};

export const table = { create, createCompact, print };
