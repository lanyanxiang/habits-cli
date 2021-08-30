import { Option } from "commander";
import { Command } from "../../models";
import { argParser } from "../../utils";
import { mainApi, network, Table } from "../../services";
import { RequestMethod, SuccessResponse } from "../../types";

type ListResponsePayload = {
  id: string;
  title: string;
  pointsChange: number;
  createdAt: string;
  updatedAt: string;
}[];

export class ListCommand extends Command {
  name: string = "list";
  description: string = "list recent transactions";
  aliases = ["ls"];

  acceptOpts = [
    new Option("-s, --skip <skip>", "number of transactions to skip").argParser(
      argParser.handleInt("skip", { min: 1 })
    ),
    new Option(
      "-l, --limit <limit>",
      "number of transactions to display"
    ).argParser(argParser.handleInt("limit", { min: 1 })),
  ];

  private async _sendRequest() {
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
    const table = new Table({
      head: ["ID", "Title", "Change in Points", "Time"],
      colWidths: [100, 200, 100, 200],
    });
    transactions.forEach(({ id, title, pointsChange, createdAt }) => {
      table.push([id, title, pointsChange, createdAt]);
    });
    console.log(table.toString());
  }

  async run(): Promise<void> {
    const response = await this._sendRequest();
    if (response.isError) {
      return;
    }
    ListCommand._displayTransactions(response);
  }
}
