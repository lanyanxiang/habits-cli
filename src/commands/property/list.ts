import { Command } from "../../models";
import { Option } from "commander";
import { validation, vschema } from "../../services";
import { ErrorResponse, SuccessResponse } from "../../types";

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
  }

  protected run(): void | Promise<void> {
    return undefined;
  }
}