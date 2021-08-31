import { QuestionCollection } from "inquirer";
import { Option } from "commander";
import { QuestionCommand } from "../../models";
import chalk from "chalk";
import { mainApi, network } from "../../services";
import { RequestMethod } from "../../types";

interface PromptAnswers {
  shouldContinue: boolean;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "confirm",
    name: "shouldContinue",
    message: "Confirm sign out?",
    default: false,
  },
];

export class SignOutCommand extends QuestionCommand<PromptAnswers> {
  name = "signout";
  description = "sign out of your habits account";
  aliases: string[] = ["logout"];

  protected promptQuestions = promptQuestions;

  acceptOpts = [new Option("-y, --yes", "proceed without confirmation")];

  protected mapOptionsToInputs(): void | Promise<void> {
    if (this.opts.yes) {
      this.userInput = {
        shouldContinue: true,
      };
    }
  }

  private async _sendRequest() {
    return await network.request(mainApi, {
      uri: "/users/signout",
      method: RequestMethod.POST,
      description: "Sign out user",
    });
  }

  async run(): Promise<void> {
    this.mapOptionsToInputs();
    await this.promptForInputs();
    if (!this.userInput?.shouldContinue) {
      console.log(
        chalk.red(
          "[Error] User cancelled sign out process. (You are NOT signed out)"
        )
      );
      return;
    }
    await this._sendRequest();
  }
}
