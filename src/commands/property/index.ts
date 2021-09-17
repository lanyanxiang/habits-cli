import { CommandGroup } from "../../models";
import { UpdateCommand } from "./update";
import { ListCommand } from "./list";

export const property = new CommandGroup("property", "manage your properties")
  .withAliases(["prop"])
  .withSubcommands([new ListCommand(), new UpdateCommand()]);
