import { Argument, Option } from "commander";
import { QuestionCollection } from "inquirer";
import { QuestionCommand, RuntimeError } from "../../models";
import { display, mainApi, network, validation, vschema } from "../../services";
import { RequestMethod, SuccessResponse } from "../../types";
import CliTable3 from "cli-table3";
import chalk from "chalk";
import { objectParser } from "../../utils";
import { prompt } from "../../services";

enum UpdateChoices {
  title = "title",
  amountChange = "change in points",
  propertyId = "property",
}

interface PromptAnswers {
  transactionId: string;
  updateChoices: UpdateChoices[];
  title?: string;
  amountChange?: number;
  propertyId?: string;
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
    filter: validation.argParser(vschema.number().propertyChange().required()),
    when: (answers) => {
      return answers.updateChoices.includes(UpdateChoices.amountChange);
    },
  },
];

const pushUpdateResultRow = (
  rowTitle: string,
  table: CliTable3.Table,
  oldValue: any,
  newValue: any
) => {
  if (oldValue !== newValue) {
    table.push([rowTitle, oldValue, "->", newValue]);
  }
};

const displayUpdateResult = (response: SuccessResponse) => {
  const payload = response.data.payload;
  const oldTransaction = payload.updatedFrom;
  const newTransaction = payload.transaction;

  console.log();
  console.log(chalk.cyan(chalk.bold(`Transaction ID ${oldTransaction.id}`)));

  const table = display.table.createCompact();
  pushUpdateResultRow(
    "Title:",
    table,
    oldTransaction.title,
    newTransaction.title
  );
  pushUpdateResultRow(
    "Change in amount:",
    table,
    oldTransaction.amountChange,
    newTransaction.amountChange
  );
  pushUpdateResultRow(
    "Property:",
    table,
    oldTransaction.property.name,
    newTransaction.property.name
  );
  if (!table.length) {
    console.log(chalk.bold("No changes applied."));
  }
  display.table.print(table);
};

export class UpdateCommand extends QuestionCommand<PromptAnswers> {
  name = "update";
  description = "update a transaction";
  aliases = ["change"];

  acceptArgs = [
    new Argument("transactionId", "object id of the transaction to be updated")
      .argOptional()
      .argParser(validation.argParser(vschema.string().objectId())),
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
    const populatedFields = this.populateInputFromOptions("title", {
      inputName: "amountChange",
      optionName: "amount",
    });
    const updateChoices: UpdateChoices[] = populatedFields.map(
      (field) => UpdateChoices[field.inputName]
    );
    if (updateChoices.length) {
      // This will also mute the question for `updateChoices`.
      this.userInput.updateChoices = updateChoices;
    }
  }

  private async _sendRequest(): Promise<SuccessResponse> {
    if (!this.userInput.transactionId) {
      throw new RuntimeError("No transaction ID");
    }

    return await network.request(mainApi, {
      uri: `/transactions/${this.userInput.transactionId}`,
      method: RequestMethod.PATCH,
      data: objectParser.excludeKeys(
        this.userInput,
        "transactionId",
        "updateChoices"
      ),
      description: `Update transaction ${this.userInput.transactionId}`,
    });
  }

  async run(): Promise<void> {
    await this.promptForInputs(promptQuestions);
    if (this.userInput.updateChoices?.includes(UpdateChoices.propertyId)) {
      const selectedProperty = await prompt.selectProperty({
        message: "What property would you like to update?",
      });
      this.userInput!.propertyId = selectedProperty.id;
    }
    const response = await this._sendRequest();
    await displayUpdateResult(response);
  }
}
