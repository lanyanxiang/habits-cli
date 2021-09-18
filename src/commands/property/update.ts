import { Option } from "commander";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";
import { mainApi, network, prompt, validation, vschema } from "../../services";
import { QuestionCommand } from "../../models";

enum UpdateChoices {
  name = "name",
  description = "description",
  amount = "amount",
  amountInStock = "amount in stock",
}

interface PromptAnswers {
  propertyId: string;
  updateChoices: UpdateChoices[];
  name?: string;
  description?: string;
  amount?: string;
  amountInStock?: string;
}

export class UpdateCommand extends QuestionCommand<PromptAnswers> {
  name = "update";
  description = "update your properties";
  aliases = ["change"];

  acceptOpts = [
    new Option("-n, --name <name>", "new value for property name"),
    new Option(
      "-d, --description <description>",
      "new value for property description"
    ),
    new Option(
      "-a, --amount <amount>",
      "new value for current amount of this property"
    ).argParser(validation.argParser(vschema.number())),
    new Option(
      "--in-stock <inStock>",
      "new value for amount of in-stock properties"
    ).argParser(validation.argParser(vschema.number().min(0))),
  ];

  protected mapArgumentsToInputs(): void | Promise<void> {
    const userInput: Partial<PromptAnswers> = this.userInput || {};

    if (this.args.length) {
      userInput.propertyId = this.args[0];
    }

    this.userInput = userInput;
  }

  protected mapOptionsToInputs(): void | Promise<void> {
    const userInput: Partial<PromptAnswers> = this.userInput || {};
    const updateChoices: UpdateChoices[] = [];

    if (this.opts.name) {
      userInput.name = this.opts.name;
      updateChoices.push(UpdateChoices.name);
    }

    if (this.opts.description) {
      userInput.description = this.opts.description;
      updateChoices.push(UpdateChoices.description);
    }

    if (this.opts.amount) {
      userInput.amount = this.opts.amount;
      updateChoices.push(UpdateChoices.amount);
    }

    if (this.opts.inStock) {
      userInput.amountInStock = this.opts.inStock;
      updateChoices.push(UpdateChoices.amountInStock);
    }

    if (updateChoices.length) {
      userInput.updateChoices = updateChoices;
    }

    this.userInput = userInput;
  }

  private async _sendRequest(): Promise<SuccessResponse | ErrorResponse> {
    return await network.request(mainApi, {
      uri: "/properties",
      method: RequestMethod.PATCH,
      data: this.userInput,
      description: "Update properties",
    });
  }

  /** Prompt for property ID in `this.userInput`. Return a boolean
   * value indicating whether this operation was successful. */
  private async _promptForPropertyId(): Promise<boolean> {
    if (!this.userInput!.propertyId) {
      const selectedProperty = await prompt.selectProperty(
        "What property would you like to update?"
      );
      if (!selectedProperty) {
        return false;
      }
      this.userInput!.propertyId = selectedProperty.id;
    }
    return true;
  }

  async run(): Promise<void> {
    if (!(await this._promptForPropertyId())) {
      return;
    }
    await this.promptForInputs([]);
    await this._sendRequest();
  }
}
