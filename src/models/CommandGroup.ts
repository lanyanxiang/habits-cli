import assert from "assert";
import { Command } from "./Command";

export class CommandGroup extends Command {
  constructor(
    public name: string,
    public description: string,
    public subcommands: Command[]
  ) {
    super();
    assert(
      !subcommands.includes(this),
      "Cannot pass a command group into `subcommands` of itself."
    );
    return this;
  }

  run(): void | Promise<void> {
    return undefined;
  }
}
