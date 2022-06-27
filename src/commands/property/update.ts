import { Argument, Option } from "commander";
import { QuestionCollection } from "inquirer";
import chalk from "chalk";
import { RequestMethod, SuccessResponse } from "../../types";
import {
  display,
  mainApi,
  network,
  prompt,
  validation,
  vschema,
} from "../../services";
import { QuestionCommand, RuntimeError } from "../../models";
import { objectParser } from "../../utils";

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
    message: "Description (leave empty to remove field):",
    validate: validation.validator(vschema.string().optional()),
    when: (answers) => {
      return answers.updateChoices.includes(UpdateChoices.description);
    },
  },
  {
    type: "input",
    name: "amount",
    message: "Amount:",
    filter: validation.argParser(vschema.number().required()),
    when: (answers) => {
      return answers.updateChoices.includes(UpdateChoices.amount);
    },
  },
  {
    type: "input",
    name: "amountInStock",
    message: "In stock (enter a negative value to remove field):",
    filter: validation.argParser(vschema.number().optional()),
    when: (answers) => {
      return answers.updateChoices.includes(UpdateChoices.amountInStock);
    },
  },
];

const displayUpdateResult = (response: SuccessResponse) => {
  const payload = response.data.payload;
  const oldProperty = payload.updatedFrom;
  const newProperty = payload.property;

  console.log();
  console.log(chalk.cyan(chalk.bold(`Property ID ${oldProperty.id}`)));

  const table = display.table.createCompact();
  display.table.pushValueUpdateRow(
    table,
    "Name",
    oldProperty.name,
    newProperty.name
  );
  display.table.pushValueUpdateRow(
    table,
    "Description",
    oldProperty.description,
    newProperty.description
  );
  display.table.pushValueUpdateRow(
    table,
    "Amount",
    oldProperty.amount,
    newProperty.amount
  );
  display.table.pushValueUpdateRow(
    table,
    "In stock",
    oldProperty.amountInStock,
    newProperty.amountInStock
  );
  if (!table.length) {
    console.log(chalk.bold("No changes applied."));
  }
  display.table.print(table);
};

export class UpdateCommand extends QuestionCommand<PromptAnswers> {
  name = "update";
  description = "update your properties";
  aliases = ["change"];

  acceptArgs = [
    new Argument("propertyId", "object id of the property to be updated")
      .argOptional()
      .argParser(validation.argParser(vschema.string().objectId())),
  ];
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
    const populatedFields = this.populateInputFromOptions(
      "name",
      "description",
      "amount",
      {
        inputName: "amountInStock",
        optionName: "inStock",
      }
    );
    const updateChoices: UpdateChoices[] = populatedFields.map(
      (field) => UpdateChoices[field.inputName]
    );
    if (updateChoices.length) {
      this.userInput.updateChoices = updateChoices;
    }
  }

  /** Prompt for property ID in `this.userInput`. */
  private async _promptForPropertyId(): Promise<void> {
    if (!this.userInput!.propertyId) {
      const selectedProperty = await prompt.selectProperty({
        message: "What property would you like to update?",
      });
      this.userInput!.propertyId = selectedProperty.id;
    }
  }

  private async _sendRequest(): Promise<SuccessResponse> {
    if (!this.userInput.propertyId) {
      throw new RuntimeError("No property ID.");
    }

    return await network.request(mainApi, {
      uri: `/properties/${this.userInput.propertyId}`,
      method: RequestMethod.PATCH,
      data: objectParser.excludeKeys(
        this.userInput,
        "propertyId",
        "updateChoices"
      ),
      description: "Update properties",
    });
  }

  async run(): Promise<void> {
    if (!this.userInput.propertyId) {
      await this._promptForPropertyId();
    }
    await this.promptForInputs(promptQuestions);
    const response = await this._sendRequest();
    displayUpdateResult(response);
  }
}
