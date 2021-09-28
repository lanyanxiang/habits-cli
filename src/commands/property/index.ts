import { CommandGroup } from "../../models";
import { UpdateCommand } from "./update";
import { ListCommand } from "./list";
import { CreateCommand } from "./create";
import { RemoveCommand } from "./remove";

export const property = new CommandGroup("property", "manage your properties")
  .withAliases(["prop"])
  .withSubcommands([
    new ListCommand(),
    new UpdateCommand(),
    new CreateCommand(),
    new RemoveCommand(),
  ]);
