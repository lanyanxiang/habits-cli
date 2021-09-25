import { QuestionCommand } from "../../models";
import { Argument } from "commander";

interface PromptAnswers {
  /** Property IDs to perform delete on. */
  propertyIds: string[];
}

export class RemoveCommand extends QuestionCommand {
  name = "remove";
  description = "remove one or more properties";
  aliases = ["delete", "rm"];
  acceptArgs = [
    new Argument(
      "<propertyId...>",
      "object IDs of the property to be removed"
    ).argOptional(),
  ];

  protected mapArgumentsToInputs(): void | Promise<void> {
    const userInput: Partial<PromptAnswers> = this.userInput || {};

    if (this.args.length) {
      userInput.propertyIds = this.args;
    }

    this.userInput = userInput;
  }

  protected run(): void | Promise<void> {
    return undefined;
  }
}
