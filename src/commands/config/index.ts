import { CommandGroup } from "../../models";
import { set } from "./set";

export const config = new CommandGroup(
  "config",
  "configure habits client"
).withSubcommands([set]);
