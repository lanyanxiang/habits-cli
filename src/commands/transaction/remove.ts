import { QuestionCollection } from "inquirer";
import { requiredValidator } from "../../utils";
import { QuestionCommand } from "../../models";
import { Argument } from "commander";

interface PromptAnswers {
  transactionId: string;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "input",
    name: "transactionId",
    message: "Transaction ID:",
    // TODO Add validation for object IDs
    validate: requiredValidator,
  },
];

export class RemoveCommand extends QuestionCommand<PromptAnswers> {
  name = "remove";
  description = "remove a transaction";
  aliases = ["delete", "rm"];
  acceptArgs = [
    new Argument("transactionId", "object id of the transaction to be removed"),
  ];
  protected promptQuestions = promptQuestions;

  run(): void | Promise<void> {
    return undefined;
  }

  protected mapArgumentsToInputs(): void | Promise<void> {
    return super.mapArgumentsToInputs();
  }
}
