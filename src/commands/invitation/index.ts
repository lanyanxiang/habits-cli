import { CommandGroup } from "../../models";

export const invitation = new CommandGroup(
  "invitation",
  "access test server invitation information"
).withSubcommands([]);
