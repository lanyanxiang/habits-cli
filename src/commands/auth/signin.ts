import inquirer, { QuestionCollection } from "inquirer";
import { Option } from "commander";
import { Command } from "../../models";
import { mainApi, network, spinners, storage } from "../../services";
import { requiredValidator, validation } from "../../utils";
import { RequestMethod, SecretType, SuccessResponse } from "../../types";
import { BasicAuthCommand } from "./BasicAuthCommand";

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
    validate: requiredValidator,
  },
];

export class SignInCommand extends BasicAuthCommand<PromptAnswers> {
  name: string = "signin";
  description: string = "sign in to your habits account";
  aliases: string[] = ["login"];

  protected promptQuestions = promptQuestions;

  acceptOpts = [new Option("-e, --email <email>", "email of user")];

  protected mapOptionsToInputs() {
    if (this.opts.email && validation.isEmail(this.opts.email)) {
      this.userInput = {
        email: this.opts.email,
      };
    }
  }

  protected async sendRequest() {
    return await network.request(mainApi, {
      uri: "/users/signin",
      method: RequestMethod.POST,
      data: this.userInput,
      description: "Authenticate user",
    });
  }
}
