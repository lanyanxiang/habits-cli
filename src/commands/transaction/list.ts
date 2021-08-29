import { Option } from "commander";
import { Command } from "../../models";

export class ListCommand extends Command {
  name: string = "list";
  description: string = "list recent transactions";
  aliases = ["ls"];

  acceptOpts = [
    new Option(
      "-s, --skip <skip>",
      "number of transactions to skip"
    ).argParser((value, _) => {}),
    new Option("-l, --limit <limit>", "number of transactions to display"),
  ];

  private _sendRequest() {}

  run(): void | Promise<void> {
    return undefined;
  }
}
