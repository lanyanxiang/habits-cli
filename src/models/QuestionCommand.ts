import { QuestionCollection } from "inquirer";
import { Command } from "./Command";
import { prompt } from "../services";

/**
 * A blueprint for command that simply prompts for user inputs once, then move on
 * to other tasks.
 * <br/> Please pass in the structure of user input (key-value) as T.
 */
export abstract class QuestionCommand<
  T extends Record<string, any>
> extends Command {
  protected userInput: Partial<T> | undefined;

  /** Process `this.opts` and set `this.userInput`. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected mapOptionsToInputs(): void | Promise<void> {}

  /** Process `this.args` and set `this.userInput`. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected mapArgumentsToInputs(): void | Promise<void> {}

  /** Display `questions` with `this.userInput` as the default.
   * Set the answers to `this.userInput`. */
  protected async promptForInput(questions: QuestionCollection<T>) {
    this.userInput = await prompt.show<T>(questions, this.userInput);
  }
}
