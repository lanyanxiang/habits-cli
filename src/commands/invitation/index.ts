import { CommandGroup } from "../../models";
import { ShowCommand } from "./show";

export const invitation = new CommandGroup(
  "invitation",
  "access test server invitation information"
).withSubcommands([new ShowCommand()]);
