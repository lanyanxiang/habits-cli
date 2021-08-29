import { Command } from "../../models";
import { network } from "../../services";

export class SignInCommand extends Command {
  name: string = "signin";
  description: string = "sign in to your habits account";
  aliases: string[] = ["login"];

  async run(): Promise<void> {
    return undefined;
  }
}
