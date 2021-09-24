import { QuestionCommand } from "../../models";

export class RemoveCommand extends QuestionCommand {
  name = "remove";
  description = "remove a property";
  aliases = ["delete", "rm"];

  protected run(): void | Promise<void> {
    return undefined;
  }
}
