import { CommandGroup } from "../../models";
import { SignInCommand } from "./signin";

export const auth = new CommandGroup("auth", "authentication").withSubcommands([
  new SignInCommand(),
]);
