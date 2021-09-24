import { QuestionCommand } from "../../models";

interface PromptAnswers {
  name: string;
  description?: string;
  amountInStock?: number;
}

export class CreateCommand extends QuestionCommand {
  name = "create";
  description = "create a new property";
  aliases = ["add"];

  protected run(): void | Promise<void> {
    return undefined;
  }
}
