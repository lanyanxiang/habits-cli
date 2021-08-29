import assert from "assert";
import { Command } from "./Command";
import { Argument } from "commander";

export class CommandGroup extends Command {
  constructor(
    public name: string,
    public description: string,
    private _subcommands: Command[]
  ) {
    super();
    this._validateSubcommands();
    this._updateAcceptArgs();
    return this;
  }

  private _validateSubcommands() {
    assert(
      !this._subcommands.includes(this),
      "Cannot pass a command group into `subcommands` of itself."
    );
  }

  /** Update accept args based on `this.subcommands` field. */
  private _updateAcceptArgs() {
    this.acceptArgs = [];
    this._subcommands.forEach((subcommand) => {
      this.acceptArgs.push(
        new Argument(subcommand.name, subcommand.description)
      );
      subcommand.aliases.forEach((alias) => {
        this.acceptArgs.push(
          new Argument(alias, `alias for "${subcommand.name}"`)
        );
      });
    });
  }

  public get subcommands(): Command[] {
    return this._subcommands;
  }

  public set subcommands(_subcommands: Command[]) {
    this._subcommands = _subcommands;
    this._validateSubcommands();
    this._updateAcceptArgs();
  }

  run(): void | Promise<void> {
    return undefined;
  }
}