import { Argument } from "commander";
import { QuestionCollection } from "inquirer";
import { requiredValidator } from "../../utils";
import { QuestionCommand } from "../../models";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";
import { mainApi, network } from "../../services";

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

  protected mapArgumentsToInputs(): void | Promise<void> {
    const userInput: Partial<PromptAnswers> = this.userInput || {};

    if (this.args.length) {
      userInput.transactionId = this.args[0];
    }

    this.userInput = userInput;
  }

  private async _sendRequest(): Promise<
    SuccessResponse | ErrorResponse | never
  > {
    if (!this.userInput?.transactionId) {
      console.error("[Error] Please specify a transaction ID.");
      // TODO Create a central error handler and a special type of error to
      //  indicate command termination. Add a method to `Command` to throw this
      //  new special error.
      throw new Error("No transaction ID");
    }

    return await network.request(mainApi, {
      uri: `/transactions/${this.userInput.transactionId}`,
      method: RequestMethod.DELETE,
      description: `Delete transaction ${this.userInput.transactionId}`,
    });
  }

  async run(): Promise<void> {
    this.mapArgumentsToInputs();
    await this.promptForInputs();
    await this._sendRequest();
  }
}
