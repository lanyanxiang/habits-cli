import { Option } from "commander";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";
import { mainApi, network, prompt, validation, vschema } from "../../services";
import { QuestionCommand, RuntimeError } from "../../models";
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
    message: "Description (empty this field to remove):",
    validate: validation.validator(vschema.string().optional()),
    when: (answers) => {
      return answers.updateChoices.includes(UpdateChoices.description);
    },
  },
  {
    type: "number",
    name: "amount",
    message: "Amount:",
    validate: validation.validator(vschema.number().required()),
    when: (answers) => {
      return answers.updateChoices.includes(UpdateChoices.amount);
    },
  },
  {
    type: "number",
    name: "amountInStock",
    message: "In stock (empty this field to remove):",
    validate: validation.validator(vschema.number().min(0).optional()),
    when: (answers) => {
      return answers.updateChoices.includes(UpdateChoices.amountInStock);
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

  /** Prompt for property ID in `this.userInput`. */
  private async _promptForPropertyId(): Promise<void> {
    if (!this.userInput!.propertyId) {
      const selectedProperty = await prompt.selectProperty(
        "What property would you like to update?"
      );
      this.userInput!.propertyId = selectedProperty.id;
    }
  }

  private async _sendRequest(): Promise<SuccessResponse | ErrorResponse> {
    if (!this.userInput?.propertyId) {
      throw new RuntimeError("No property ID.");
    }

    return await network.request(mainApi, {
      uri: `/properties/${this.userInput.propertyId}`,
      method: RequestMethod.PATCH,
      data: {
        ...this.userInput,
        propertyId: undefined,
      },
      description: "Update properties",
    });
  }

  async run(): Promise<void> {
    await this._promptForPropertyId();
    await this.promptForInputs(promptQuestions);
    await this._sendRequest();
  }
}
