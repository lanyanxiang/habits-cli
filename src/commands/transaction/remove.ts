import { QuestionCollection } from "inquirer";
import { requiredValidator } from "../../utils";

interface PromptAnswers {
  transactionId: string;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "input",
    name: "transactionId",
    message: "Transaction ID:",
    // TODO Add validation for object IDs
    validate: requiredValidator,
  },
];
