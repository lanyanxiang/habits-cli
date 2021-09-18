import { Option } from "commander";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";
import { mainApi, network, validation, vschema } from "../../services";
import { QuestionCommand } from "../../models";

enum UpdateChoices {
  name = "name",
  description = "description",
  amount = "amount",
  amountInStock = "amount in stock",
}

interface PromptAnswers {
  propertyId: number;
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
    new Option(
      "-p, --points <points>",
      "new points value to be stored"
    ).argParser(validation.argParser(vschema.number().label("points"))),
  ];

  protected mapOptionsToInputs(): void | Promise<void> {
    const userInput: Partial<PromptAnswers> = this.userInput || {};

    if (this.opts.points !== undefined) {
      userInput.points = this.opts.points;
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

  async run(): Promise<void> {
    await this.promptForInputs(promptQuestions);
    await this._sendRequest();
  }
}
