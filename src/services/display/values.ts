/*
 * Methods for value display.
 */

import chalk from "chalk";

/**
 * Get string for `pointsChange` that can be output by `console.log` or
 * equivalent.
 * @param pointsChange Points to display.
 */
const formatPointsChange = (pointsChange: number) => {
  return pointsChange < 0
    ? chalk.red(`(${pointsChange})`)
    : chalk.green(`+${pointsChange}`);
};

export const values = {
  formatPointsChange,
};
