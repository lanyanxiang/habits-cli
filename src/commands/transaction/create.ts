import { QuestionCommand } from "../../models";

interface PromptAnswers {
  title: string;
  pointsChange: string;
}

export class CreateCommand extends QuestionCommand<PromptAnswers> {
  name = "create";
  description = "create a new transaction";
  aliases = ["add"];

  protected promptQuestions = [];

  run(): void | Promise<void> {
    return undefined;
  }
}
