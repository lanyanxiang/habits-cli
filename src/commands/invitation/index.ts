import { CommandGroup } from "../../models";
import { ShowCommand } from "./show";
import { ActivateCommand } from "./activate";

export const invitation = new CommandGroup(
  "invitation",
  "access test server invitation information"
).withSubcommands([new ShowCommand(), new ActivateCommand()]);
