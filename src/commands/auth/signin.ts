import inquirer, { QuestionCollection } from "inquirer";
import { Option } from "commander";
import { Command } from "../../models";
import { mainApi, network, spinners, storage } from "../../services";
import { validation } from "../../utils";
import { RequestMethod, SecretType, SuccessResponse } from "../../types";

interface PromptAnswers {
  email: string;
  password: string;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "input",
    name: "email",
    message: "Email:",
    validate: (input, _) => {
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
    validate: (input, _) => {
      if (input?.length) {
        return true;
      }
      return "Please enter a password.";
    },
  },
];

export class SignInCommand extends Command {
  name: string = "signin";
  description: string = "sign in to your habits account";
  aliases: string[] = ["login"];

  private userInput: Partial<PromptAnswers> | undefined;

  acceptOpts = [new Option("-e, --email <email>", "email of user")];

  private _processOptions() {
    if (this.opts.email && validation.isEmail(this.opts.email)) {
      this.userInput = {
        email: this.opts.email,
      };
    }
  }

  private async _promptForCredentials() {
    this.userInput = await inquirer.prompt<PromptAnswers>(
      promptQuestions,
      this.userInput
    );
  }

  private async _sendSignInRequest() {
    return await network.request(mainApi, {
      uri: "/users/signin",
      method: RequestMethod.POST,
      data: this.userInput,
      description: "Authenticate user",
    });
  }

  private async _storeAuthTokens(response: SuccessResponse) {
    const spinner = spinners.start("Persist secure session");

    const { accessToken, refreshToken } = response.data.payload!;
    try {
      await Promise.all([
        storage.secrets.set(SecretType.accessToken, accessToken),
        storage.secrets.set(SecretType.refreshToken, refreshToken),
      ]);
    } catch (error: unknown) {
      spinner.fail();
      console.error("[Error] Could not persist your session.");
      throw error;
    }

    spinner.succeed();
  }

  async run(): Promise<void> {
    this._processOptions();
    await this._promptForCredentials();

    const response = await this._sendSignInRequest();
    if (response.isError) {
      return;
    }
    await this._storeAuthTokens(response);
  }
}
