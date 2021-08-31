import { CommandGroup } from "../../models";
import { ListCommand } from "./list";
import { CreateCommand } from "./create";
import { UpdateCommand } from "./update";
import { RemoveCommand } from "./remove";

export const transaction = new CommandGroup(
  "transaction",
  "manage changes in points"
)
  .withAliases(["tran"])
  .withSubcommands([
    new ListCommand(),
    new CreateCommand(),
    new UpdateCommand(),
    new RemoveCommand(),
  ]);
