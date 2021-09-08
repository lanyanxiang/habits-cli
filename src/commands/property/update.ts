import { QuestionCommand } from "../../models";
import { QuestionCollection } from "inquirer";
import { Option } from "commander";
import { argParser } from "../../utils";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";
import { mainApi, network } from "../../services";

interface PromptAnswers {
  points: number;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "number",
    name: "points",
    message: "New total points:",
  },
];

export class UpdateCommand extends QuestionCommand<PromptAnswers> {
  name = "update";
  description = "update your properties";
  aliases = ["change"];

  protected promptQuestions = promptQuestions;

  acceptOpts = [
    new Option(
      "-p, --points <points>",
      "new points value to be stored"
    ).argParser(argParser.handleFloat("points")),
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
    this.mapOptionsToInputs();
    await this.promptForInputs();
    await this._sendRequest();
  }
}
