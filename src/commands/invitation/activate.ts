import { QuestionCommand } from "../../models";
import { QuestionCollection } from "inquirer";
import { Argument } from "commander";
import { display, mainApi, network, vschema } from "../../services";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";
import chalk from "chalk";

interface PromptAnswers {
  email: string;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "input",
    name: "email",
    message: "Email:",
    validate: (input) => {
      if (vschema.string().email().isValidSync(input)) {
        return true;
      }
      return "Please enter a valid email address.";
    },
  },
];

export class ActivateCommand extends QuestionCommand<PromptAnswers> {
  name = "activate";
  description = "activate your invitation";

  acceptArgs = [new Argument("email").argOptional()];

  protected mapArgumentsToInputs() {
    const userInput: Partial<PromptAnswers> = {};

    if (this.args.length) {
      userInput.email = this.args[0];
    }

    this.userInput = userInput;
  }

  private async _sendRequest(): Promise<SuccessResponse | ErrorResponse> {
    return await network.request(mainApi, {
      uri: "/invitations/activate",
      method: RequestMethod.POST,
      data: this.userInput,
      description: "Activate user invitation",
    });
  }

  private _displayResponse(response: SuccessResponse): void {
    const {
      testSessionStartAt,
      testSessionExpireAt,
      serverName,
      serverLocation,
      testPhase,
      email,
    } = response.data.payload;
    console.log();
    console.log("Thank you for helping the growth of habits CLI!");
    console.log();
    const table = display.table.createCompact();
    table.push(["Email", chalk.cyan(email)]);
    table.push([
      "Session Start Time",
      chalk.cyan(display.datetime.format(new Date(testSessionStartAt))),
    ]);
    if (testSessionExpireAt) {
      table.push([
        "Session Expire At",
        chalk.red(display.datetime.format(new Date(testSessionExpireAt))),
      ]);
    }
    table.push(["Test Phase", chalk.green(testPhase)]);
    table.push(["Server Name", chalk.green(serverName)]);
    table.push(["Server Location", chalk.cyan(serverLocation)]);
    display.table.print(table);
    console.log();
    console.log("Your invitation has been successfully activated. Please run");
    console.log(chalk.green("habits auth signup --email " + email));
    console.log("...to complete your registration process.");
    console.log();
    console.log(chalk.cyan("Happy hacking!"));
  }

  async run(): Promise<void> {
    await this.promptForInputs(promptQuestions);
    const response = await this._sendRequest();
    if (response.isError) {
      return;
    }
    this._displayResponse(response);
  }
}
