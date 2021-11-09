import { CommandGroup } from "../../../models";

export const set = new CommandGroup(
  "set",
  "set value for a configuration field"
).withSubcommands([]);
