import { CommandGroup } from "../../models";

export const transaction = new CommandGroup(
  "transaction",
  "manage changes in points"
)
  .withAliases(["tran"])
  .withSubcommands([]);
