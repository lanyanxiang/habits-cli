import { Argument } from "commander";
import chalk from "chalk";
import { QuestionCommand } from "../../models";
import { RequestMethod } from "../../types";
import { mainApi, network, prompt, validation, vschema } from "../../services";
import { RuntimeError } from "../../models/RuntimeError";

interface PromptAnswers {
  /** Transaction IDs to perform delete on. */
  transactionIds: string[];
}

const transactionIdQuestion = {
  type: "input",
  // Note the missing "s", in comparison to the `transactionIds`
  // key in `PromptAnswers`.
  name: "transactionId",
  message: "Transaction ID:",
  validate: validation.validator(vschema.string().objectId()),
};
const transactionIdRequiredQuestion = {
  ...transactionIdQuestion,
  validate: validation.validator(vschema.string().objectId().required()),
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

  protected mapArgumentsToInputs(): void | Promise<void> {
    const userInput: Partial<PromptAnswers> = this.userInput || {};

    if (this.args.length) {
      userInput.transactionIds = this.args;
    }

    this.userInput = userInput;
  }

  private _printInstructions() {
    console.log(
      "Please enter the IDs of the transactions that you would like to remove.\n"
    );
    console.log(chalk.italic(chalk.bold("Instructions: ")));
    console.log(`- Enter ${chalk.cyan(chalk.bold("one ID"))} per row. `);
    console.log(
      `- Press ${chalk.cyan(
        chalk.bold("enter")
      )} without entering anything to finish.`
    );
    console.log(
      `- Enter ${chalk.cyan(
        chalk.bold("at least one")
      )} transaction ID to remove.`
    );
  }

  protected async promptForInputs(): Promise<void> {
    if (this.userInput?.transactionIds) {
      // This means transaction IDs were passed in using variadic arguments
      return;
    }

    this._printInstructions();
    console.log();
    const userInput = this.userInput || {};
    const { transactionId: initialTranId } = await prompt.show([
      transactionIdRequiredQuestion,
    ]);
    userInput.transactionIds = [initialTranId];

    /** The remove command will continue to prompt for more transaction IDs and
     * set user input when this value is `true`. */
    let shouldContinuePrompting = true;
    while (shouldContinuePrompting) {
      const { transactionId } = await prompt.show([transactionIdQuestion]);
      if (!transactionId?.length) {
        // An empty transaction ID will make the program stop asking for more.
        shouldContinuePrompting = false;
        break;
      }
      userInput.transactionIds.push(transactionId);
    }

    this.userInput = userInput;
  }

  private async _sendRequest(): Promise<void> {
    if (!this.userInput?.transactionIds) {
      throw new RuntimeError("Please specify a transaction ID.");
    }

    for (const transactionId of this.userInput.transactionIds) {
      await network.request(mainApi, {
        uri: `/transactions/${transactionId}`,
        method: RequestMethod.DELETE,
        description: `Remove transaction ${transactionId}`,
      });
    }
  }

  async run(): Promise<void> {
    await this.promptForInputs();
    await this._sendRequest();
  }
}
