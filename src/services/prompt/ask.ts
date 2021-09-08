import { inquirer } from "../inquirer";

export const ask = <T>(
  questions: inquirer.QuestionCollection<T>,
  initialAnswers?: Partial<T>
) => {
  return inquirer.prompt<T>(questions, initialAnswers);
};
