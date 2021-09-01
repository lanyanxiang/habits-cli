import { CommandGroup } from "../../models";
import { ShowCommand } from "./show";

export const property = new CommandGroup("property", "manage your properties")
  .withAliases(["prop"])
  .withSubcommands([new ShowCommand()]);
