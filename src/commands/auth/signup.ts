import { Command } from "../../models";
import inquirer, { QuestionCollection } from "inquirer";
import { requiredValidator, validation } from "../../utils";
import { Option } from "commander";

interface PromptAnswers {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const promptQuestions: QuestionCollection<PromptAnswers> = [
  {
    type: "input",
    name: "email",
    message: "Email:",
    validate: (input, _) => {
      if (validation.isEmail(input)) {
        return true;
      }
      return "Please enter a valid email address.";
    },
  },
  {
    type: "password",
    name: "password",
    message: "New Password:",
    mask: "*",
    validate: requiredValidator,
  },
  {
    type: "password",
    name: "confirmPassword",
    message: "Enter password again:",
    mask: "*",
    validate: (input, answers) => {
      if (input === answers?.password) {
        return true;
      }
      return "Passwords do not match.";
    },
  },
  {
    type: "input",
    name: "firstName",
    message: "First Name:",
    validate: requiredValidator,
  },
  {
    type: "input",
    name: "lastName",
    message: "Last Name:",
    validate: requiredValidator,
  },
];

export class SignUpCommand extends Command {
  name: string = "signup";
  description: string = "create a new habits account";

  private _userInput: Partial<PromptAnswers> | undefined;

  acceptOpts = [
    new Option("-e, --email <email>", "email of new user"),
    new Option("-f, --first-name <firstName>", "first name of new user"),
    new Option("-l, --last-name <lastName>", "last name of new user"),
  ];

  private _processOptions() {
    const userInput: Partial<PromptAnswers> = {};
    if (this.opts.email && validation.isEmail(this.opts.email)) {
      userInput.email = this.opts.email;
    }
    if (this.opts.firstName.length) {
      userInput.firstName = this.opts.firstName;
    }
    if (this.opts.lastName.length) {
      userInput.lastName = this.opts.lastName;
    }
    this._userInput = userInput;
  }

  private async _promptForCredentials() {
    this._userInput = await inquirer.prompt<PromptAnswers>(
      promptQuestions,
      this._userInput
    );
  }

  run(): void | Promise<void> {
    return undefined;
  }
}
