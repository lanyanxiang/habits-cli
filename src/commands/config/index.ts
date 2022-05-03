import { CommandGroup } from "../../models";
import { set } from "./set";
import { get } from "./get";

export const config = new CommandGroup(
  "config",
  "configure habits client"
).withSubcommands([set, get]);
