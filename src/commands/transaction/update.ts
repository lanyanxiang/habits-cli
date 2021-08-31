import { QuestionCollection } from "inquirer";
import { QuestionCommand } from "../../models";
import { pointsChangeValidator, requiredValidator } from "../../utils";
import { Argument, Option } from "commander";

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

export class UpdateCommand extends QuestionCommand<any> {
  name = "update";
  description = "update a transaction";
  aliases = ["change"];

  protected promptQuestions = promptQuestions;

  acceptArgs = [
    new Argument(
      "transactionId",
      "object id of the transaction to be updated"
    ).argOptional(),
  ];
  acceptOpts = [
    new Option("-t, --title <title>", "new title for the target transaction"),
    new Option("-p, --points <pointsChange>", "new value for change in points"),
  ];

  protected mapArgumentsToInputs(): void | Promise<void> {
    const userInput: Partial<PromptAnswers> = this.userInput || {};

    if (this.args.length) {
      userInput.transactionId = this.args[0];
    }

    this.userInput = userInput;
  }

  protected mapOptionsToInputs(): void | Promise<void> {
    const userInput: Partial<PromptAnswers> = this.userInput || {};

    if (this.opts.title) {
      userInput.title = this.opts.title;
    }

    if (this.opts.pointsChange) {
      userInput.pointsChange = this.opts.pointsChange;
    }

    this.userInput = userInput;
  }

  async run(): Promise<void> {}
}
