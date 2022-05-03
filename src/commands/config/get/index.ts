import { CommandGroup } from "../../../models";
import { GetEndpointCommand } from "./endpoint";

export const get = new CommandGroup(
  "get",
  "get value for a configuration field"
).withSubcommands([new GetEndpointCommand()]);
