import { QuestionCollection } from "inquirer";
import { QuestionCommand } from "../../models";
import { Argument, Option } from "commander";
import { mainApi, network, validator, vschema } from "../../services";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";

enum UpdateChoices {
  title = "title",
  pointsChange = "change in points",
}

interface PromptAnswers {
  transactionId: string;
  updateChoices: UpdateChoices[];
  title?: string;
  pointsChange?: number;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "input",
    name: "transactionId",
    message: "Transaction ID:",
    validate: validator.construct(vschema.string().objectId().required()),
  },
  {
    type: "checkbox",
    name: "updateChoices",
    message: "What fields would you like to update? (multiple select)",
    choices: Object.values(UpdateChoices),
    validate: validator.construct(
      vschema.string().oneOf(Object.values(UpdateChoices)).required()
    ),
  },
  {
    type: "input",
    name: "title",
    message: "Title",
    validate: validator.construct(vschema.string().required()),
    when: (answers) => {
      return answers.updateChoices.includes(UpdateChoices.title);
    },
  },
  {
    type: "number",
    name: "pointsChange",
    message: "Change in points:",
    validate: validator.construct(vschema.number().propertyChange()),
    when: (answers) => {
      return answers.updateChoices.includes(UpdateChoices.pointsChange);
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
    new Option("-t, --title <title>", "new title for the target transaction"),
    new Option("-p, --points <points>", "new value for change in points"),
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

    if (this.opts.points) {
      userInput.pointsChange = Number(this.opts.points);
      updateChoices.push(UpdateChoices.pointsChange);
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
      console.error("[Error] Please specify a transaction ID.");
      // TODO Create a central error handler and a special type of error to
      //  indicate command termination. Add a method to `Command` to throw this
      //  new special error.
      throw new Error("No transaction ID");
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
