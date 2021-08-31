import { QuestionCollection } from "inquirer";
import { Option } from "commander";
import { QuestionCommand } from "../../models";

interface PromptAnswers {
  shouldContinue: boolean;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "confirm",
    name: "shouldContinue",
    message: "Confirm sign out?",
  },
];

export class SignOutCommand extends QuestionCommand<PromptAnswers> {
  name = "signout";
  description = "sign out of your habits account";
  aliases: string[] = ["logout"];

  protected promptQuestions = promptQuestions;

  acceptOpts = [new Option("-y, --yes", "proceed without confirmation")];

  run(): void | Promise<void> {
    return undefined;
  }
}
