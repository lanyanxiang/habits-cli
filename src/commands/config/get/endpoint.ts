import { Command } from "../../../models";
import { defaultConfig, userConfig } from "../../../config";
import { Endpoints } from "../../../types";
import { display } from "../../../services";
import chalk from "chalk";

export class GetEndpointCommand extends Command {
  description = "get endpoint that the habits client requests to";
  name = "endpoint";

  protected run(): void {
    const endpointName =
      userConfig.get("endpointName") || defaultConfig.endpointName;
    const endpointUrl = Endpoints[endpointName];
    const table = display.table.createCompact();
    table.push([chalk.cyan(chalk.bold("Name")), endpointName]);
    table.push([chalk.cyan(chalk.bold("URL")), endpointUrl]);
    display.table.print(table);
  }
}
