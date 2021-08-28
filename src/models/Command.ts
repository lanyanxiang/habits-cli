import {
  Argument,
  Option,
  Command as CommanderCommand,
  OptionValues,
} from "commander";
import { HelpTextPosition } from "../types";

interface HelpCommand {
  enableOrNameAndArgs?: string | boolean | undefined;
  description?: string | undefined;
}

interface HelpOption {
  flags?: string;
  description: string;
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

  /* Constructor */
  protected constructor(private _command: CommanderCommand) {}

  /* *************************************
   * Class methods
   ************************************* */
  protected addHelpText(position: HelpTextPosition, text: string) {
    this._command.addHelpText(position, text);
  }

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
