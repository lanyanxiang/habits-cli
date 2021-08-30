import { CommandGroup } from "../../models";
import { ListCommand } from "./list";

export const transaction = new CommandGroup(
  "transaction",
  "manage changes in points"
)
  .withAliases(["tran"])
  .withSubcommands([new ListCommand()]);
