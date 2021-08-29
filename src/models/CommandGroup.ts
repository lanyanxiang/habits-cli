import assert from "assert";
import { Command } from "./Command";
import { Argument } from "commander";

export class CommandGroup extends Command {
  private _subcommands: Command[] = [];

  constructor(public name: string, public description: string) {
    super();
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
        new Argument(subcommand.name, subcommand.description).argOptional()
      );
      subcommand.aliases.forEach((alias) => {
        this.acceptArgs.push(
          new Argument(alias, `alias for "${subcommand.name}"`).argOptional()
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

  // Some convenient helpers to enable faster chain configuration
  public withSubcommands(subcommands: Command[]) {
    this.subcommands = subcommands;
    return this;
  }

  public withAliases(aliases: string[]) {
    this.aliases = aliases;
    return this;
  }

  run(): void | Promise<void> {
    return undefined;
  }
}
