/*
 * Construction and display methods for table.
 */

import Table from "cli-table3";

const create = (options?: Partial<Table.TableOptions>) => {
  return new Table({
    style: { border: [], head: ["cyan"] },
    wordWrap: true,
    ...options,
  });
};

const print = (table: Table.Table) => {
  console.log(table.toString());
};

export const table = { create, print };
