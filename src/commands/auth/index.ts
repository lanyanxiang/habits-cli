import { CommandGroup } from "../../models";

export const auth = new CommandGroup("auth", "authentication").withSubcommands(
  []
);
