import { stringParser } from "../utils";

/**
 * This class represents a standard error that occurs during the execution
 * of the program. This error is meant to be thrown manually inside of the
 * program, when a logic cannot be continued. Throwing this error will trigger
 * the central error handler to log this error and exit immediately afterwards.
 *
 * Multiple errors may be thrown at the same time. Simply throw an array of
 * RuntimeError objects.
 */
export class RuntimeError extends Error {
  /**
   * Name to be displayed when the error is logged. e.g. `[Name] Error message`.
   */
  public name = "Error";
  public cause: string | undefined;

  constructor(message?: string) {
    super(message);

    // Configure this class to work with typescript
    // Need this statement when extending a typescript built-in class
    Object.setPrototypeOf(this, RuntimeError.prototype);
  }

  serialize(): string {
    let msg = `[${this.name}] ${this.message}`;
    if (this.cause) {
      const cause = stringParser.camelToSpaceSeparated(this.cause);
      msg += `\n> Caused by ${cause}`;
    }
    return msg;
  }
}
