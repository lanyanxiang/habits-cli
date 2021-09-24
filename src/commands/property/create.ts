import { QuestionCommand } from "../../models";

export class CreateCommand extends QuestionCommand {
  name = "create";
  description = "create a new property";
  aliases = ["add"];

  protected run(): void | Promise<void> {
    return undefined;
  }
}
