import { QuestionCommand } from "../../models";
import { QuestionCollection } from "inquirer";
import { requiredValidator } from "../../utils";
import { Option } from "commander";

interface PromptAnswers {
  title: string;
  pointsChange: string;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "input",
    name: "title",
    message: "Transaction title:",
    validate: requiredValidator,
  },
  {
    type: "number",
    name: "pointsChange",
    message: "Change in points:",
    validate: (input: any) => {
      if (Number(input) != 0) {
        return true;
      }
      return (
        "Change in points cannot be 0. Enter a positive " +
        "number to add points, and a negative number to reduce " +
        "points."
      );
    },
  },
];

export class CreateCommand extends QuestionCommand<PromptAnswers> {
  name = "create";
  description = "create a new transaction";
  aliases = ["add"];

  protected promptQuestions = promptQuestions;

  acceptOpts = [
    new Option("-t, --title, -m, --message <title>", "title this transaction"),
    new Option(
      "-p, --points <pointsChange>",
      "change in points for this transaction"
    ),
  ];

  protected mapOptionsToInputs(): void | Promise<void> {
    const userInput: Partial<PromptAnswers> = {};

    if (this.opts.title) {
      userInput.title = this.opts.title;
    }
    if (this.opts.pointsChange) {
      userInput.pointsChange = this.opts.pointsChange;
    }

    this.userInput = userInput;
  }

  run(): void | Promise<void> {
    return undefined;
  }
}
