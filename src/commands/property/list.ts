import { Command } from "../../models";
import { Option } from "commander";
import { mainApi, network, validation, vschema } from "../../services";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";

interface Property {
  id: string;
  name: string;
  description: string;
  amount: string;
  amountInStock: string;
}

export class ListCommand extends Command {
  name = "list";
  description = "list your properties";
  aliases = ["ls"];

  acceptOpts = [
    new Option("-s, --skip <skip>", "number of properties to skip").argParser(
      validation.argParser(vschema.number().pageSkip())
    ),
    new Option(
      "-l, --limit <limit>",
      "number of properties to display"
    ).argParser(validation.argParser(vschema.number().pageLimit())),
  ];

  private async _sendRequest(): Promise<SuccessResponse | ErrorResponse> {
    const skip = this.opts.skip;
    const limit = this.opts.limit;

    return await network.request(mainApi, {
      uri: "/properties",
      method: RequestMethod.GET,
      config: {
        params: {
          skip,
          limit,
        },
      },
      description: "Fetch properties",
      shouldClearSpinner: true,
    });
  }

  private _displayProperties(response: SuccessResponse) {}

  protected run(): void | Promise<void> {
    return undefined;
  }
}
