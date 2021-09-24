import { QuestionCommand } from "../../models";
import { QuestionCollection } from "inquirer";
import { validation, vschema } from "../../services";

interface PromptAnswers {
  name: string;
  description?: string;
  amountInStock?: number;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "input",
    name: "name",
    message: "Property name:",
    validate: validation.validator(vschema.string().min(1).max(50).required()),
  },
  {
    type: "input",
    name: "description",
    message: "Description (optional):",
    validate: validation.validator(vschema.string()),
  },
  {
    type: "input",
    name: "amountInStock",
    message: "In stock (optional):",
    filter: validation.argParser(vschema.number().positive()),
  },
];

export class CreateCommand extends QuestionCommand {
  name = "create";
  description = "create a new property";
  aliases = ["add"];

  protected run(): void | Promise<void> {
    return undefined;
  }
}
