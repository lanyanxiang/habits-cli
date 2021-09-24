import { QuestionCommand } from "../../models";
import { Argument } from "commander";

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

  protected run(): void | Promise<void> {
    return undefined;
  }
}
