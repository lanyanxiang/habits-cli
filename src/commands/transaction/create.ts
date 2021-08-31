import { QuestionCommand } from "../../models";
import { QuestionCollection } from "inquirer";
import { pointsChangeValidator, requiredValidator } from "../../utils";
import { Option } from "commander";
import { mainApi, network } from "../../services";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";

interface PromptAnswers {
  title: string;
  pointsChange: string;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "input",
    name: "title",
    message: "Transaction title:",
    validate: requiredValidator,
  },
  {
    type: "number",
    name: "pointsChange",
    message: "Change in points:",
    validate: pointsChangeValidator,
  },
];

export class CreateCommand extends QuestionCommand<PromptAnswers> {
  name = "create";
  description = "create a new transaction";
  aliases = ["add"];

  protected promptQuestions = promptQuestions;

  acceptOpts = [
    new Option("-t, --title <title>", "title this transaction"),
    new Option(
      "-p, --points <pointsChange>",
      "change in points for this transaction"
    ),
  ];

  protected mapOptionsToInputs(): void | Promise<void> {
    const userInput: Partial<PromptAnswers> = {};

    if (this.opts.title) {
      userInput.title = this.opts.title;
    }
    if (this.opts.pointsChange) {
      userInput.pointsChange = this.opts.pointsChange;
    }

    this.userInput = userInput;
  }

  private async _sendRequest(): Promise<SuccessResponse | ErrorResponse> {
    return await network.request(mainApi, {
      uri: "/transactions",
      method: RequestMethod.POST,
      data: this.userInput,
      description: "Create transaction",
    });
  }

  async run(): Promise<void> {
    this.mapOptionsToInputs();
    await this.promptForInputs();
    await this._sendRequest();
  }
}
