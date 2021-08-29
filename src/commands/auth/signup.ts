import { Command } from "../../models";

export class SignUpCommand extends Command {
  name: string = "signup";
  description: string = "create a new habits account";

  run(): void | Promise<void> {
    return undefined;
  }
}
