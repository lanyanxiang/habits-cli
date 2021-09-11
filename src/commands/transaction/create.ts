import { QuestionCollection } from "inquirer";
import { Option } from "commander";
import { QuestionCommand } from "../../models";
import { mainApi, network, validator, vschema } from "../../services";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";

interface PromptAnswers {
  title: string;
  pointsChange: number;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "input",
    name: "title",
    message: "Transaction title:",
    validate: validator.construct(vschema.string().required()),
    default: "Untitled transaction",
  },
  {
    type: "number",
    name: "pointsChange",
    message: "Change in points:",
    validate: validator.construct(vschema.number().propertyChange()),
  },
];

export class CreateCommand extends QuestionCommand<PromptAnswers> {
  name = "create";
  description = "create a new transaction";
  aliases = ["add"];

  acceptOpts = [
    new Option("-t, --title <title>", "title this transaction"),
    new Option(
      "-p, --points <points>",
      "change in points for this transaction"
    ),
  ];

  protected mapOptionsToInputs(): void | Promise<void> {
    const userInput: Partial<PromptAnswers> = {};

    if (this.opts.title) {
      userInput.title = this.opts.title;
    }
    if (this.opts.points) {
      userInput.pointsChange = Number(this.opts.points);
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
    await this.promptForInputs(promptQuestions);
    await this._sendRequest();
  }
}
