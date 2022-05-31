import { CommandGroup } from "../../../models";
import { SetEndpointCommand } from "./endpoint";

export const set = new CommandGroup(
  "set",
  "set value for a configuration field"
).withSubcommands([new SetEndpointCommand()]);
