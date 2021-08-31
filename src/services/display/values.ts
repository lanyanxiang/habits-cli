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
  const pointsLocalStr = points.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
  return points < 0
    ? chalk.red(`(${pointsLocalStr})`)
    : chalk.green(`+${pointsLocalStr}`);
};

export const values = {
  formatPoints,
};
