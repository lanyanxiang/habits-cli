/*
 * Methods for value display.
 */

/**
 * Get string for `points` that can be output by `console.log` or
 * equivalent.
 * @param points Points to display.
 */
const formatPoints = (points: number) => {
  const pointsLocalStr = points.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
  return points < 0 ? `(${pointsLocalStr})` : pointsLocalStr;
};

export const values = {
  formatPoints,
};
