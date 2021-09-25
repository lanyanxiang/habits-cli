import { QuestionCommand } from "../../models";
import { Argument } from "commander";
import chalk from "chalk";

interface PromptAnswers {
  /** Property IDs to perform delete on. */
  propertyIds: string[];
}

const printInstructions = () => {
  console.log(
    "Please enter the IDs of the properties that you would like to remove.\n"
  );
  console.log(chalk.italic(chalk.bold("Instructions: ")));
  console.log(`- Enter ${chalk.cyan(chalk.bold("one ID"))} per row. `);
  console.log(
    `- Press ${chalk.cyan(
      chalk.bold("enter")
    )} without entering anything to finish.`
  );
  console.log(
    `- Enter ${chalk.cyan(chalk.bold("at least one"))} property ID to remove.`
  );
};

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

  protected mapArgumentsToInputs(): void | Promise<void> {
    const userInput: Partial<PromptAnswers> = this.userInput || {};

    if (this.args.length) {
      userInput.propertyIds = this.args;
    }

    this.userInput = userInput;
  }

  protected run(): void | Promise<void> {
    return undefined;
  }
}
