import { CommandGroup } from "../../models";
import { SignInCommand } from "./signin";
import { SignUpCommand } from "./signup";

export const auth = new CommandGroup("auth", "authentication").withSubcommands([
  new SignInCommand(),
  new SignUpCommand(),
]);
