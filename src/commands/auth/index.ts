import { CommandGroup } from "../../models";
import { SignInCommand } from "./signin";
import { SignUpCommand } from "./signup";
import { SignOutCommand } from "./signout";

export const auth = new CommandGroup("auth", "authentication").withSubcommands([
  new SignInCommand(),
  new SignUpCommand(),
  new SignOutCommand(),
]);
