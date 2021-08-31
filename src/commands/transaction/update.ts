import { QuestionCommand } from "../../models";
import { QuestionCollection } from "inquirer";
import { pointsChangeValidator, requiredValidator } from "../../utils";

interface PromptAnswers {
  transactionId: string;
  title?: string;
  pointsChange?: number;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "input",
    name: "transactionId",
    // TODO Add validation for object IDs
    validate: requiredValidator,
  },
  {
    type: "input",
    name: "title",
    validate: requiredValidator,
  },
  {
    type: "number",
    name: "pointsChange",
    validate: pointsChangeValidator,
  },
];

export class UpdateCommand extends QuestionCommand<any> {}
