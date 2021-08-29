import { Command } from "../../models";
import { Option } from "commander";

export class LoginCommand extends Command {
  name: string = "login";
  description: string = "log in to your account";

  acceptOpts = [
    new Option("-a").hideHelp(true),
    new Option("-b"),
    new Option("-c"),
  ];

  run(): void | Promise<void> {
    console.log(this.args);
    console.log(this.opts);
  }
}

export class LogoutCommand extends Command {
  name: string = "logout";
  description: string = "log out of your account";

  acceptOpts = [
    new Option("-d").hideHelp(true),
    new Option("-e"),
    new Option("-f"),
    new Option("-x"),
    new Option("-y"),
  ];

  run(): void | Promise<void> {
    console.log(this.args);
    console.log(this.opts);
  }
}
