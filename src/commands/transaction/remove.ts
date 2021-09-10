import { Argument } from "commander";
import { requiredValidator } from "../../utils";
import { QuestionCommand } from "../../models";
import { RequestMethod } from "../../types";
import { mainApi, network } from "../../services";
import { inquirer } from "../../services/prompt/inquirer";
import chalk from "chalk";

interface PromptAnswers {
  /** Transaction IDs to perform delete on. */
  transactionIds: string[];
}

// TODO Add validation for object IDs
const transactionIdQuestion = {
  type: "input",
  // Note the missing "s", in comparison to the `transactionIds`
  // key in `PromptAnswers`.
  name: "transactionId",
  message: "Transaction ID:",
};
const transactionIdRequiredQuestion = {
  ...transactionIdQuestion,
  validate: requiredValidator,
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

  // We do not use the default prompt questions method here, so we pass
  // in empty array.
  protected promptQuestions = [];

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
    const { transactionId: initialTranId } = await inquirer.prompt([
      transactionIdRequiredQuestion,
    ]);
    userInput.transactionIds = [initialTranId];

    /** The remove command will continue to prompt for more transaction IDs and
     * set user input when this value is `true`. */
    let shouldContinuePrompting = true;
    while (shouldContinuePrompting) {
      const { transactionId } = await inquirer.prompt([transactionIdQuestion]);
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
      console.error("[Error] Please specify a transaction ID.");
      // TODO Create a central error handler and a special type of error to
      //  indicate command termination. Add a method to `Command` to throw this
      //  new special error.
      throw new Error("No transaction ID");
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
    this.mapArgumentsToInputs();
    await this.promptForInputs();
    await this._sendRequest();
  }
}
