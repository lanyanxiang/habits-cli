import { Command } from "../../models";
import { network } from "../../services";
import inquirer from "inquirer";
import { validation } from "../../utils";

interface PromptAnswers {
  email: string;
  password: string;
}

export class SignInCommand extends Command {
  name: string = "signin";
  description: string = "sign in to your habits account";
  aliases: string[] = ["login"];

  private email: string = "";
  private password: string = "";

  private async _promptForCredentials() {
    const answers = inquirer.prompt<PromptAnswers>([
      {
        type: "input",
        name: "email",
        message: "Email:",
        validate: (
          input: any,
          _?: PromptAnswers
        ): boolean | string | Promise<boolean | string> => {
          if (validation.isEmail(input)) {
            return true;
          }
          return "Please enter a valid email address.";
        },
      },
      {
        type: "password",
        name: "password",
        message: "Password:",
        mask: "*",
      },
    ]);
    console.log(answers);
  }

  async run(): Promise<void> {
    await this._promptForCredentials();
    return undefined;
  }
}
