import { Command } from "../../models";

export class AuthCommand extends Command {
  description: string = "authenticate";
  name: string = "auth";

  run(): void | Promise<void> {
    console.log("auth command");
    console.log(this.args);
    console.log(this.opts);
  }
}
