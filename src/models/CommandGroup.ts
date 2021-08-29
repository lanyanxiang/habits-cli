import assert from "assert";
import { Command } from "./Command";
import { Argument } from "commander";

export class CommandGroup extends Command {
  private _subcommands: Command[] = [];
  /** A mapping of subcommand name (or alias) to subcommand itself.
   * This map is used to speed-up command lookups at runtime. */
  private _subcommands_map: { [name: string]: Command } = {};

  // This class represents a group of commands (or even group of
  // group of commands), so excess arguments and excess options
  // should be passed to the commands handling them.
  allowExcessArguments: boolean = true;
  allowUnknownOption: boolean = true;

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
    const subcommandNames: string[] = [];
    this._subcommands.forEach((subcommand) => {
      subcommandNames.push(subcommand.name);
      subcommand.aliases.forEach((alias) => {
        subcommandNames.push(alias);
      });
    });
    this.acceptArgs = [
      new Argument(`${this.name} command`, `subcommand of ${this.name}`)
        .argRequired()
        .choices(subcommandNames),
    ];
  }

  /** Build a subcommands map using `this._subcommands` and write directly
   * to `this._subcommands_map`. */
  private _build_subcommands_map() {
    // Override old map
    this._subcommands_map = {};
    this._subcommands.forEach((subcommand) => {
      this._subcommands_map[subcommand.name] = subcommand;
      subcommand.aliases.forEach((alias) => {
        this._subcommands_map[alias] = subcommand;
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
    this._build_subcommands_map();
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

  protected filterParsingArgs(): string[] {
    // We only want to process the first argument.
    // The CommandGroup is a special case, because we want
    // to pass the remaining options and arguments to the
    // subcommand handling them.
    return this.rawArgs.slice(0, 1);
  }

  run(): void | Promise<void> {
    const subcommandName = this.args[0]; // By argument definition.
    const subcommandArgs = this.rawArgs.slice(1);

    if (!(subcommandName in this._subcommands_map)) {
      throw new Error(
        `Subcommand ${subcommandName} could not be found in subcommands map.` +
          "Please double-check `_build_subcommands_map` in class `CommandGroup`."
      );
    }
    const subcommand = this._subcommands_map[subcommandName];
    subcommand.init(subcommandArgs).run();
  }
}
