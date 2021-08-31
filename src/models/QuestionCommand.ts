import { Command } from "./Command";
import inquirer, { QuestionCollection } from "inquirer";

/**
 * A blueprint for command that simply prompts for user inputs once, then move on
 * to other tasks.
 * <br/> Please pass in the structure of user input (key-value) as T.
 */
export abstract class QuestionCommand<
  T extends Record<string, any>
> extends Command {
  protected userInput: Partial<T> | undefined;
  protected abstract promptQuestions: QuestionCollection<T>;

  /** Process `this.opts` and set `this.userInput`. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected mapOptionsToInputs(): void | Promise<void> {}

  /** Process `this.args` and set `this.userInput`. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected mapArgumentsToInputs(): void | Promise<void> {}

  /** Display `promptQuestions` with `this.userInput` as the default. */
  protected async promptForInputs() {
    this.userInput = await inquirer.prompt<T>(
      this.promptQuestions,
      this.userInput
    );
  }
}
