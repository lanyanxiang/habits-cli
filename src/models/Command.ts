import { Argument, Option, OptionValues } from "commander";
import { CommanderCommand, HelpTextPosition } from "../types";

export interface HelpCommand {
  enableOrNameAndArgs?: string | boolean | undefined;
  description?: string | undefined;
}

export interface HelpOption {
  flags?: string;
  description: string;
}

export interface HelpText {
  position: HelpTextPosition;
  text: string;
}

/**
 * A regular command.
 */
export abstract class Command {
  /* *************************************
   * Signature
   ************************************* */
  /** Name and argument for this command. */
  abstract name: string;
  /** Description of this command to show in help message. */
  abstract description: string;

  /* *************************************
   * Inputs
   ************************************* */
  /** Options that this command accepts. */
  acceptOpts: Option[] = [];
  /** Arguments that this command accepts. */
  acceptArgs: Argument[] = [];

  /* *************************************
   * Other configurations
   ************************************* */
  /** Allow more arguments than specified in the `acceptArgs` property. */
  allowExcessArguments: boolean = false;
  /** Override help command's name or description or both. */
  helpCommand: HelpCommand | undefined = undefined;
  /** Flags and a description to override the help flags and help description
   * Pass in false to disable the built-in help option. */
  helpOption: HelpOption | undefined = undefined;
  helpTexts: HelpText[] | undefined = undefined;

  /* Constructor */
  protected constructor(
    private _command: CommanderCommand,
    protected rawArgs: string[]
  ) {}

  protected adaptCommanderCommand = () => {
    // This method serves as an adaptor to commander commands.
    // This method registers definitions a command to the commander
    // command instance.
    this._command.name(this.name);
    this._command.description(this.description);

    // Options and arguments
    this.acceptOpts.forEach((opt) => {
      this._command.addOption(opt);
    });
    this.acceptArgs.forEach((arg) => {
      this._command.addArgument(arg);
    });

    this._command.allowExcessArguments(this.allowExcessArguments);

    if (this.helpCommand) {
      this._command.addHelpCommand(
        this.helpCommand.enableOrNameAndArgs,
        this.helpCommand.description
      );
    }
    if (this.helpOption) {
      this._command.helpOption(
        this.helpOption.flags,
        this.helpOption.description
      );
    }
    if (this.helpTexts) {
      this.helpTexts.forEach((helpText) =>
        this._addHelpText(helpText.position, helpText.text)
      );
    }

    // When the `from` option is set to "user", commander do not
    // skip the first 1 - 2 items in the `rawArgs` array.
    this._command.parse(this.rawArgs, { from: "user" });
  };

  private _addHelpText(position: HelpTextPosition, text: string) {
    this._command.addHelpText(position, text);
  }

  /* *************************************
   * Class methods
   ************************************* */

  /** Object of valid options passed into this command.
   * Remember to declare `acceptOptions` for this to work. */
  protected get opts(): OptionValues {
    return this._command.opts();
  }

  /** Get arguments passed into this command. */
  protected get args(): string[] {
    return this._command.args;
  }

  public abstract run(): void | Promise<void>;
}
