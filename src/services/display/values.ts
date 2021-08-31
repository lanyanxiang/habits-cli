/*
 * Methods for value display.
 */

import chalk from "chalk";

/**
 * Get string for `points` that can be output by `console.log` or
 * equivalent.
 * @param points Points to display.
 */
const formatPoints = (points: number) => {
  return points < 0 ? chalk.red(`(${points})`) : chalk.green(`+${points}`);
};

export const values = {
  formatPoints,
};
