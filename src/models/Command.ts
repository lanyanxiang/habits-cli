/*
 * This file contains an abstract class.
 * Some life-cycle methods are called for child class flexibility, so the
 * not-allowing empty function eslint rule is disabled for this file.
 */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Argument,
  Help,
  Option,
  OptionValues,
  OutputConfiguration,
} from "commander";
import { CommanderCommand, HelpTextPosition } from "../types";

export interface CommandOverride {
  enableOrNameAndArgs?: string | boolean | undefined;
  description?: string | undefined;
}

export interface OptionOverride {
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
   * Reserved
   ************************************* */
  private _command: CommanderCommand = new CommanderCommand();
  protected rawArgs: string[] = [];

  /* *************************************
   * Signature
   ************************************* */
  /** Name for this command. */
  abstract name: string;
  /** Description of this command to show in help message. */
  abstract description: string;
  /** Only works when passed into a command group. If this command
   * is the top-most command, then no alias is possible. */
  aliases: string[] = [];
  /** Version of command. */
  version: string | undefined;
  /** The option used to display version. Defaults to `-V` and `--version`. */
  versionOption: OptionOverride | undefined;

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
  allowExcessArguments = false;
  /** Allow unknown option and surpass options validation. */
  allowUnknownOption = false;
  /** Display help message after error. */
  showHelpAfterError = false;
  /** Override help command's name or description or both. */
  helpCommand: CommandOverride | undefined;
  /** Flags and a description to override the help flags and help description
   * Pass in false to disable the built-in help option. */
  helpOption: OptionOverride | undefined;
  /** Extra help texts to display for this command. */
  helpTexts: HelpText[] | undefined;

  constructor() {
    return this;
  }

  /**
   * Initialize the current command and the current class properties
   * with `rawArgs`. Call this method after configuration of this command
   * is completed, just shortly before `run`.
   */
  protected readonly init = (rawArgs: string[]) => {
    // Save param values
    this.rawArgs = rawArgs;
    this._adaptCommanderCommand();
    this.configureHelp(this._command.configureHelp());
    this.configureOutput(this._command.configureOutput());
    this._parseArgs();
  };

  /** Register definitions of this command to the commander command instance. */
  private _adaptCommanderCommand() {
    this._command.name(this.name);
    this._command.description(this.description);
    this._command.aliases(this.aliases);
    if (this.version) {
      this._command.version(
        this.version,
        this.versionOption?.flags,
        this.versionOption?.description
      );
    }

    // Options and arguments
    this.acceptOpts.forEach((opt) => {
      this._command.addOption(opt);
    });
    this.acceptArgs.forEach((arg) => {
      this._command.addArgument(arg);
    });

    this._command.allowExcessArguments(this.allowExcessArguments);
    this._command.allowUnknownOption(this.allowUnknownOption);

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
      this.helpTexts.forEach(({ position, text }) => {
        this._command.addHelpText(position, text);
      });
    }
    this._command.showHelpAfterError(this.showHelpAfterError);
  }

  /** Parse command arguments */
  private _parseArgs() {
    const argsToParse = this.filterParsingArgs();

    // When the `from` option is set to "user", commander do not
    // skip the first 1 - 2 items in the `rawArgs` array.
    this._command.parse(argsToParse, { from: "user" });
  }

  /* *************************************
   * Life-cycle methods
   ************************************* */
  /** Method called on initialization of command.
   * Update members and/or methods in `help` directly. */
  protected configureHelp(help: Partial<Help>): void {}
  /** Method called on initialization of command.
   * Update members and/or methods in `output` directly. */
  protected configureOutput(output: OutputConfiguration): void {}
  /** Return arguments that should be used/considered for command parsing.
   * Please start with `this.rawArgs`. By default, we parse all args passed
   * into this command. This method is called on initialization of command. */
  protected filterParsingArgs(): string[] {
    return this.rawArgs;
  }
  /** Life-cycle method called prior to initialization of this command.
   * The argument `rawArgs` is the raw argument passed by user. */
  protected commandWillInit(rawArgs: string[]): void {}
  /** Life-cycle method called post initialization of the command.*/
  protected commandDidInit(): void {}
  /** Life-cycle method called before running the command (i.e., calling
   *  this.run` class method. */
  protected commandWillRun(): void {}
  /** Life-cycle method called post running the command. */
  protected commandDidRun(): void {}

  /* *************************************
   * Class methods
   ************************************* */
  /** Print help message for this command. */
  protected printHelp() {
    this._command.outputHelp();
  }

  /** Object of valid options passed into this command.
   * Remember to declare `acceptOptions` for this to work. */
  protected get opts(): OptionValues {
    return this._command.opts();
  }

  /** Get arguments passed into this command. Arguments are in
   * the order of the `acceptArgs` array. */
  protected get args(): string[] {
    return this._command.args;
  }

  /** Entry point to this command. This method should contain the core business
   * logic for the command. In this method, you may get options and arguments
   * passed into this command through `this.opts` and `this.args`. */
  protected abstract run(): void | Promise<void>;

  /**
   * Start this command with argument list `rawArgs`. This method should
   * only be called outside of the `Command` class.<br />
   *
   * You should not worry about calling this method if the command is passed
   * into a command group (i.e., this is a sub-command). <br/>
   *
   * If this command is used on the top level, then rawArgs will be
   * `process.argv.slice(2)`, since the first item in `argv` will be
   * a path to node, and the second item will be the program name.
   */
  public readonly start = async (rawArgs: string[]): Promise<void> => {
    this.commandWillInit(rawArgs);
    this.init(rawArgs);
    this.commandDidInit();
    this.commandWillRun();
    await this.run();
    this.commandDidRun();
  };
}
