import { QuestionCollection } from "inquirer";
import { inquirer } from "../inquirer";

export const ask = <T>(
  questions: QuestionCollection<T>,
  initialAnswers?: Partial<T>
) => {
  return inquirer.prompt<T>(questions, initialAnswers);
};
