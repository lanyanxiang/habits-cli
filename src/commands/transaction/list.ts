import chalk from "chalk";
import { Option } from "commander";
import { QuestionCommand } from "../../models";
import {
  display,
  mainApi,
  network,
  prompt,
  validation,
  vschema,
} from "../../services";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";

type ListResponsePayload = {
  id: string;
  title: string;
  amountChange: number;
  property: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}[];

interface PromptAnswers {
  propertyId?: string;
}

const getTransactionsTable = (transactions: ListResponsePayload) => {
  const table = display.table.create({
    head: ["#", "Title", "Amount", "Property", "Created At"],
    colWidths: [5, 18, 10, 12, 17],
    colAligns: ["left", "left", "right", "left", "left"],
  });
  transactions.forEach(
    ({ id, title, amountChange, property, createdAt }, index) => {
      table.push([
        {
          colSpan: 5,
          hAlign: "center",
          content: chalk.cyan(`Transaction ID ${id}`),
        },
      ]);
      table.push([
        index,
        title,
        display.values.formatPointsChange(amountChange),
        property.name,
        display.datetime.format(new Date(createdAt)),
      ]);
    }
  );
  return table;
};

const getCompactTransactionsTable = (transactions: ListResponsePayload) => {
  const table = display.table.createCompact({
    head: ["Trans ID", "Title", "Amount", "Property"],
    colWidths: [28, 18, 10, 12],
    colAligns: ["center", "left", "left", "left"],
  });
  transactions.forEach(({ id, title, amountChange, property }) => {
    table.push([
      id,
      title,
      display.values.formatPointsChange(amountChange),
      property.name,
    ]);
  });
  return table;
};

export class ListCommand extends QuestionCommand<PromptAnswers> {
  name = "list";
  description = "list recent transactions";
  aliases = ["ls"];

  acceptOpts = [
    new Option("-s, --skip <skip>", "number of transactions to skip").argParser(
      validation.argParser(vschema.number().pageSkip())
    ),
    new Option(
      "-l, --limit <limit>",
      "number of transactions to display"
    ).argParser(validation.argParser(vschema.number().pageLimit())),
    new Option(
      "-p, --property [propertyId]",
      "ID of the property involved in this transaction - " +
        "if not provided, a select prompt will be shown."
    ).argParser(validation.argParser(vschema.string().objectId())),
    new Option(
      "-c, --compact",
      "display a compact and concise table of transactions"
    ),
  ];

  protected mapOptionsToInputs(): void | Promise<void> {
    if (this.opts.propertyId) {
      this.userInput = { propertyId: this.opts.propertyId };
    }
  }

  /**
   * Prompt for property ID if a property option is specified, but
   * an ID is not provided. e.g., when running `habits property ls -p`.
   * @private
   */
  private async _promptForProperty(): Promise<void> {
    if (this.opts.propertyId && !this.userInput.propertyId) {
      const property = await prompt.selectProperty({
        message: "Please select a property to view transactions:",
      });
      this.userInput = { propertyId: property.id };
    }
  }

  private async _sendRequest(): Promise<SuccessResponse | ErrorResponse> {
    const skip = this.opts.skip;
    const limit = this.opts.limit;
    const propertyId = this.userInput.propertyId;

    return await network.request(mainApi, {
      uri: "/transactions",
      method: RequestMethod.GET,
      config: {
        params: {
          skip,
          limit,
          propertyId,
        },
      },
      description: "Fetch transactions",
      shouldClearSpinner: true,
    });
  }

  async run(): Promise<void> {
    await this._promptForProperty();
    const response = await this._sendRequest();
    if (response.isError) {
      return;
    }
    if (!this.opts.concise) {
      displayTransactions(response);
    } else {
      displayConciseTransactions(response);
    }
  }
}
