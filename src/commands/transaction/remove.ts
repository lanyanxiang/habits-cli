import { Argument } from "commander";
import { requiredValidator } from "../../utils";
import { QuestionCommand } from "../../models";
import { RequestMethod } from "../../types";
import { mainApi, network } from "../../services";

interface PromptAnswers {
  /** Transaction IDs to perform delete on. */
  transactionIds: string[];
}

const getPromptQuestions = (self: RemoveCommand) => {
  return [
    {
      type: "input",
      name: "transactionIds",
      message: "Transaction ID:",
      // TODO Add validation for object IDs
      validator: requiredValidator,
      filter: (input: any, answers: PromptAnswers) => {
        if (!input?.length) {
          // If the user enters an empty value, stop asking for
          // more transaction IDs.
          self.shouldContinuePrompting = false;
          return answers.transactionIds;
        }
        return [...answers.transactionIds, input];
      },
    },
  ];
};

export class RemoveCommand extends QuestionCommand<PromptAnswers> {
  name = "remove";
  description = "remove one or more transactions";
  aliases = ["delete", "rm"];
  acceptArgs = [
    new Argument(
      "<transactionId...>",
      "object IDs of the transaction to be removed"
    ).argOptional(),
  ];

  /** The remove command will continue to prompt for more transaction IDs and
   * set user input when this value is `true`. */
  shouldContinuePrompting = true;
  protected promptQuestions = getPromptQuestions(this);

  protected mapArgumentsToInputs(): void | Promise<void> {
    const userInput: Partial<PromptAnswers> = this.userInput || {};

    if (this.args.length) {
      userInput.transactionIds = this.args;
    }

    this.userInput = userInput;
  }

  private async _sendRequest(): Promise<void> {
    if (!this.userInput?.transactionIds) {
      console.error("[Error] Please specify a transaction ID.");
      // TODO Create a central error handler and a special type of error to
      //  indicate command termination. Add a method to `Command` to throw this
      //  new special error.
      throw new Error("No transaction ID");
    }

    for (const transactionId of this.userInput.transactionIds) {
      const response = await network.request(mainApi, {
        uri: `/transactions/${transactionId}`,
        method: RequestMethod.DELETE,
        description: `Remove transaction ${transactionId}`,
      });
      if (response.isError) {
        return;
      }
    }
  }

  async run(): Promise<void> {
    this.mapArgumentsToInputs();
    await this.promptForInputs();
    await this._sendRequest();
  }
}
