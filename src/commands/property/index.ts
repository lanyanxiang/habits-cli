import { CommandGroup } from "../../models";
import { ShowCommand } from "./show";
import { UpdateCommand } from "./update";

export const property = new CommandGroup("property", "manage your properties")
  .withAliases(["prop"])
  .withSubcommands([new ShowCommand(), new UpdateCommand()]);
