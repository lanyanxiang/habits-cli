import { Option } from "commander";
import { Command } from "../../models";
import { argParser } from "../../utils";
import { mainApi, network } from "../../services";
import { RequestMethod } from "../../types";

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
    });
  }

  async run(): Promise<void> {
    const response = await this._sendRequest();
    if (response.isError) {
      return;
    }
  }
}
