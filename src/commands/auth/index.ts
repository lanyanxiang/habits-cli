import { Command } from "../../models";
import { Option } from "commander";

export class AuthCommand extends Command {
  name: string = "auth";
  description: string = "authenticate";

  acceptOpts = [new Option("-a"), new Option("-b"), new Option("-c")];

  run(): void | Promise<void> {
    console.log(this.args);
    console.log(this.opts);
  }
}
