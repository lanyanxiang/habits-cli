import { QuestionCommand } from "../../models";

interface PromptAnswers {
  transactionId: string;
  title?: string;
  pointsChange?: number;
}

export class UpdateCommand extends QuestionCommand<any> {}
