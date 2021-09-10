import { Command } from "../models";

const start = (command: Command, args: string[]) => {};

/**
 * Command runner to initialize and run a command based on arguments
 * (and options) passed to the command.
 */
export const runner = {
  start,
};
