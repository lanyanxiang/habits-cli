import { QuestionCollection } from "inquirer";
import { Command } from "./Command";
import { prompt } from "../services";

/**
 * A blueprint for command that prompts the user for questions.
 * This abstract class provides a structure to storing and prompting for user
 * inputs.
 * <br/> Please pass in the structure of user input (key-value) as T.
 */
export abstract class QuestionCommand<
  T extends Record<string, any> = any
> extends Command {
  protected userInput: Partial<T> = {};
  /** Optional keys in `userInput`. This array is used in methods such as
   * `promptForInputs` so that empty strings will not be added to `userInput`
   * record. This property is used as default keys in `sanitizeUserInput`. */
  protected optionalFields: (keyof T)[] = [];

  /** Process `this.opts` and set `this.userInput`. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected mapOptionsToInputs(): void | Promise<void> {}

  /** Process `this.args` and set `this.userInput`. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected mapArgumentsToInputs(): void | Promise<void> {}

  protected commandDidInit() {
    super.commandDidInit();
    this.mapOptionsToInputs();
    this.mapArgumentsToInputs();
  }

  /** Display `questions` with `this.userInput` as the default.
   * Set the answers to `this.userInput`. If you want to manage how
   * the prompt result is used, please refer to the `prompt` api directly. */
  protected async promptForInputs(
    questions: QuestionCollection<T>
  ): Promise<void> {
    this.userInput = await prompt.show<T>(questions, this.userInput);
    this.sanitizeUserInput();
  }

  /**
   * Remove optional keys in `this.userInput` if they contain null values.
   * @param fields Fields to sanitize. Defaults to `this.optionalFields`.
   */
  protected sanitizeUserInput(fields?: (keyof T)[]): void {
    const userInput = this.userInput;
    if (!userInput) {
      return;
    }
    const fieldsToSanitize = fields || this.optionalFields;
    fieldsToSanitize.forEach((field) => {
      // Remove null values if field is optional.
      if (field in userInput && !userInput[field]) {
        delete userInput[field];
      }
    });
    this.userInput = userInput;
  }

  /**
   * Set `fields` of `this.userInput` from currently defined options.
   * If a field corresponds to an undefined option value, then that
   * field will not be set.
   *
   * @param fields A variadic argument where each element is a string OR
   * an object with keys `inputName` AND `optionName`. When an element is
   * an object, input with `inputName` in `this.userInput` will be set to
   * the value passed in by the option with `optionName`. When an
   * element is a string, it will be regarded as if `inputName` and `optionName`
   * are the same.
   */
  protected populateInputFromOptions(
    ...fields: (
      | (keyof T & string)
      | { inputName: keyof T & string; optionName: string }
    )[]
  ): void {
    for (const field of fields) {
      const isFieldString = typeof field === "string";
      const optionName = isFieldString ? field : field.optionName;
      const inputName = isFieldString ? field : field.inputName;

      const opt = this.opts[optionName];
      if (opt !== undefined) {
        this.userInput[inputName] = opt;
      }
    }
  }
}
