import { CommandGroup } from "../../models";
import { SetCommand } from "./set";

export const config = new CommandGroup(
  "config",
  "configure habits client"
).withSubcommands([new SetCommand()]);
