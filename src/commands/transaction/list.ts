import { Option } from "commander";
import { Command } from "../../models";
import { display, mainApi, network, validation, vschema } from "../../services";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";
import chalk from "chalk";

type ListResponsePayload = {
  id: string;
  title: string;
  amountChange: number;
  createdAt: string;
  updatedAt: string;
}[];

export class ListCommand extends Command {
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
  ];

  private async _sendRequest(): Promise<SuccessResponse | ErrorResponse> {
    const skip = this.opts.skip;
    const limit = this.opts.limit;

    return await network.request(mainApi, {
      uri: "/transactions",
      method: RequestMethod.GET,
      config: {
        params: {
          skip,
          limit,
        },
      },
      description: "Fetch transactions",
      shouldClearSpinner: true,
    });
  }

  private static _displayTransactions(response: SuccessResponse) {
    const transactions = response.data.payload as ListResponsePayload;
    const table = display.table.create({
      head: ["NO.", "Title", "Amount", "Created At"],
      colWidths: [5, 20, 10, 18],
      colAligns: ["left", "left", "right", "left"],
    });
    transactions.forEach(({ id, title, amountChange, createdAt }, index) => {
      table.push([
        {
          colSpan: 4,
          hAlign: "center",
          content: chalk.cyan(`Transaction ID ${id}`),
        },
      ]);
      table.push([
        index,
        title,
        display.values.formatPointsChange(amountChange),
        display.datetime.format(new Date(createdAt)),
      ]);
    });
    display.table.print(table);
  }

  async run(): Promise<void> {
    const response = await this._sendRequest();
    if (response.isError) {
      return;
    }
    ListCommand._displayTransactions(response);
  }
}
