import { Command } from "../../../models";
import { userConfig } from "../../../config";
import { Endpoints } from "../../../types";
import { display } from "../../../services";

export class GetEndpointCommand extends Command {
  description = "get endpoint that the habits client requests to";
  name = "endpoint";

  protected run(): void {
    const endpointName = userConfig.get("endpointName");
    const endpointUrl = Endpoints[endpointName];
    const table = display.table.createCompact({ head: ["Name", "Base URL"] });
    table.push([endpointName, endpointUrl]);
    display.table.print(table);
  }
}
