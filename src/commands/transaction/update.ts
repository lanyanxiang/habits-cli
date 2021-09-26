import { Argument, Option } from "commander";
import { QuestionCollection } from "inquirer";
import { QuestionCommand, RuntimeError } from "../../models";
import { mainApi, network, validation, vschema } from "../../services";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";

enum UpdateChoices {
  title = "title",
  amountChange = "change in points",
}

interface PromptAnswers {
  transactionId: string;
  updateChoices: UpdateChoices[];
  title?: string;
  amountChange?: number;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "input",
    name: "transactionId",
    message: "Transaction ID:",
    validate: validation.validator(vschema.string().objectId().required()),
  },
  {
    type: "checkbox",
    name: "updateChoices",
    message: "What fields would you like to update? (multiple select)",
    choices: Object.values(UpdateChoices),
    validate: validation.validator(
      vschema
        .array()
        .of(vschema.string().oneOf(Object.values(UpdateChoices)))
        .min(1)
        .required()
    ),
  },
  {
    type: "input",
    name: "title",
    message: "Title:",
    validate: validation.validator(vschema.string().required()),
    when: (answers) => {
      return answers.updateChoices.includes(UpdateChoices.title);
    },
  },
  {
    type: "input",
    name: "amountChange",
    message: "Change in amount:",
    filter: validation.validator(vschema.number().propertyChange().required()),
    when: (answers) => {
      return answers.updateChoices.includes(UpdateChoices.amountChange);
    },
  },
];

export class UpdateCommand extends QuestionCommand<PromptAnswers> {
  name = "update";
  description = "update a transaction";
  aliases = ["change"];

  acceptArgs = [
    new Argument(
      "transactionId",
      "object id of the transaction to be updated"
    ).argOptional(),
  ];
  acceptOpts = [
    new Option(
      "-t, --title <title>",
      "new title for the target transaction"
    ).argParser(validation.argParser(vschema.string().min(2).max(80))),
    new Option(
      "-a, --amount <points>",
      "new value for change in amount"
    ).argParser(validation.argParser(vschema.number().propertyChange())),
  ];

  protected mapArgumentsToInputs(): void | Promise<void> {
    const userInput: Partial<PromptAnswers> = this.userInput || {};

    if (this.args.length) {
      userInput.transactionId = this.args[0];
    }

    this.userInput = userInput;
  }

  protected mapOptionsToInputs(): void | Promise<void> {
    const userInput: Partial<PromptAnswers> = this.userInput || {};
    const updateChoices: UpdateChoices[] = [];

    if (this.opts.title) {
      userInput.title = this.opts.title;
      updateChoices.push(UpdateChoices.title);
    }

    if (this.opts.amount) {
      userInput.amountChange = this.opts.points;
      updateChoices.push(UpdateChoices.amountChange);
    }

    if (updateChoices.length) {
      // This will also mute the question for `updateChoices`.
      userInput.updateChoices = updateChoices;
    }
    this.userInput = userInput;
  }

  private async _sendRequest(): Promise<
    SuccessResponse | ErrorResponse | never
  > {
    if (!this.userInput?.transactionId) {
      throw new RuntimeError("No transaction ID");
    }

    return await network.request(mainApi, {
      uri: `/transactions/${this.userInput.transactionId}`,
      method: RequestMethod.PATCH,
      data: {
        ...this.userInput,
        transactionId: undefined,
      },
      description: `Update transaction ${this.userInput.transactionId}`,
    });
  }

  async run(): Promise<void> {
    await this.promptForInputs(promptQuestions);
    await this._sendRequest();
  }
}
