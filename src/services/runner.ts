import { Command } from "../models";

/**
 * Initialize and run `command` with `args`.
 * @param command Command or command group to start.
 * @param args Raw arguments list to be passed into `command`.
 */
const start = (command: Command, args: string[]) => {};

/**
 * Command runner to initialize and run a command based on arguments
 * (and options) passed to the command.
 */
export const runner = {
  start,
};
