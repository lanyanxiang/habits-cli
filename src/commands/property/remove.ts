import { QuestionCommand, RuntimeError } from "../../models";
import { Argument } from "commander";
import chalk from "chalk";
import { mainApi, network, prompt } from "../../services";
import { RequestMethod, UserProperty } from "../../types";
import { show } from "../../services/prompt/show";
import { matchSorter } from "match-sorter";

interface PromptAnswers {
  /** Property IDs to perform delete on. */
  propertyIds: string[];
}

const promptMessage = "Which property would you like to delete?";

const printInstructions = () => {
  console.log("Please enter the properties that you would like to remove.\n");
  console.log(chalk.italic(chalk.bold("Instructions: ")));
  console.log(`- Enter ${chalk.cyan(chalk.bold("one property"))} per row. `);
  console.log(
    `- Press ${chalk.cyan(
      chalk.bold("enter")
    )} without entering anything to finish.`
  );
  console.log(
    `- Enter ${chalk.cyan(chalk.bold("at least one"))} property to remove.`
  );
};

export class RemoveCommand extends QuestionCommand<PromptAnswers> {
  name = "remove";
  description = "remove one or more properties";
  aliases = ["delete", "rm"];
  private properties: UserProperty[] = [];

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

  /** Fetch properties and save to `this.properties` array. */
  async fetchProperties() {
    const {
      data: { payload: properties },
    } = await network.request(mainApi, {
      uri: "/properties",
      method: RequestMethod.GET,
      description: "Fetch your properties",
      shouldClearSpinner: true,
    });
    this.properties = properties;
  }

  /**
   * Prompt for a property from `names`.
   * @param names An array of property names available to be selected.
   */
  async promptProperty(names: string[]) {
    const answer = await show([
      {
        name: "propertyName",
        message: "Select a property:",
        type: "autocomplete",
        source: (_, input) => {
          if (!input) {
            return names;
          }
          return matchSorter(names, input);
        },
      },
    ]);
    return this.properties.find(
      (property) => property.name === answer.propertyName
    )!;
  }

  protected async promptForInputs(): Promise<void> {
    if (this.userInput?.propertyIds) {
      // This means property IDs were passed in using variadic arguments
      return;
    }

    printInstructions();
    console.log();
    const userInput = this.userInput || {};
    const property = await prompt.selectProperty({
      message: promptMessage,
    });
    userInput.propertyIds = [property!.id!];

    let shouldContinuePrompting = true;
    while (shouldContinuePrompting) {
      const property = await prompt.selectProperty({
        message: promptMessage,
      });
      if (!property) {
        shouldContinuePrompting = false;
        break;
      }
      userInput.propertyIds.push(property.id!);
    }

    this.userInput = userInput;
  }

  private async _sendRequest(): Promise<void> {
    if (!this.userInput?.propertyIds) {
      throw new RuntimeError("Please specify a property ID.");
    }

    for (const propertyId of this.userInput.propertyIds) {
      await network.request(mainApi, {
        uri: `/properties/${propertyId}`,
        method: RequestMethod.DELETE,
        description: `Remove property ${propertyId}`,
      });
    }
  }

  protected async run(): Promise<void> {
    await this.promptForInputs();
    await this._sendRequest();
  }
}
