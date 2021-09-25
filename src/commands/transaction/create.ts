import { QuestionCollection } from "inquirer";
import { Option } from "commander";
import { QuestionCommand } from "../../models";
import { mainApi, network, validation, vschema } from "../../services";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";

interface PromptAnswers {
  propertyId: string;
  title: string;
  amountChange: number;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "input",
    name: "title",
    message: "Transaction title:",
    validate: validation.validator(vschema.string().required()),
    default: "Untitled transaction",
  },
  {
    type: "input",
    name: "amountChange",
    message: "Change in amount:",
    filter: validation.argParser(vschema.number().propertyChange()),
  },
];

export class CreateCommand extends QuestionCommand<PromptAnswers> {
  name = "create";
  description = "create a new transaction";
  aliases = ["add"];

  acceptOpts = [
    new Option("--property-id <propertyId>", "ID of the property involved"),
    new Option("-t, --title <title>", "title this transaction"),
    new Option(
      "-a, --amount <amount>",
      "change in points for this transaction"
    ),
  ];

  protected mapOptionsToInputs(): void | Promise<void> {
    const userInput: Partial<PromptAnswers> = {};

    if (this.opts.propertyId) {
      userInput.propertyId = this.opts.propertyId;
    }
    if (this.opts.title) {
      userInput.title = this.opts.title;
    }
    if (this.opts.points) {
      userInput.amountChange = Number(this.opts.amount);
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
