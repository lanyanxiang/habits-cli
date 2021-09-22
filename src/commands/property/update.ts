import { Option } from "commander";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";
import { mainApi, network, prompt, validation, vschema } from "../../services";
import { QuestionCommand } from "../../models";
import { QuestionCollection } from "inquirer";

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

const promptQuestions: QuestionCollection<PromptAnswers> = [
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
    name: "name",
    message: "Name:",
    validate: validation.validator(vschema.string().required()),
    when: (answers) => {
      return answers.updateChoices.includes(UpdateChoices.name);
    },
  },
  {
    type: "input",
    name: "description",
    message: "Description:",
    validate: validation.validator(vschema.string().required()),
    when: (answers) => {
      return answers.updateChoices.includes(UpdateChoices.description);
    },
  },
  {
    type: "input",
    name: "amount",
    message: "Amount:",
    validate: validation.validator(vschema.number().required()),
    when: (answers) => {
      return answers.updateChoices.includes(UpdateChoices.amount);
    },
  },
];

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

  /** Prompt for property ID in `this.userInput`. */
  private async _promptForPropertyId(): Promise<void> {
    if (!this.userInput!.propertyId) {
      const selectedProperty = await prompt.selectProperty(
        "What property would you like to update?"
      );
      this.userInput!.propertyId = selectedProperty.id;
    }
  }

  async run(): Promise<void> {
    await this._promptForPropertyId();
    await this.promptForInputs([]);
    await this._sendRequest();
  }
}
