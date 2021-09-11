import { QuestionCollection } from "inquirer";
import { validation } from "../../utils";
import { Option } from "commander";
import { BasicAuthCommand } from "./BasicAuthCommand";
import { mainApi, network, validator, vschema } from "../../services";
import { RequestMethod } from "../../types";

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
    validate: validator.construct(vschema.string().email().required()),
  },
  {
    type: "password",
    name: "password",
    message: "New Password:",
    mask: "*",
    validate: validator.construct(vschema.string().required()),
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
    validate: validator.construct(vschema.string().required()),
  },
  {
    type: "input",
    name: "lastName",
    message: "Last Name:",
    validate: validator.construct(vschema.string().required()),
  },
];

export class SignUpCommand extends BasicAuthCommand<PromptAnswers> {
  name = "signup";
  description = "create a new habits account";

  protected promptQuestions = promptQuestions;

  acceptOpts = [
    new Option("-e, --email <email>", "email of new user"),
    new Option("-f, --first-name <firstName>", "first name of new user"),
    new Option("-l, --last-name <lastName>", "last name of new user"),
  ];

  protected mapOptionsToInputs() {
    const userInput: Partial<PromptAnswers> = {};
    if (this.opts.email && validation.isEmail(this.opts.email)) {
      userInput.email = this.opts.email;
    }
    if (this.opts.firstName?.length) {
      userInput.firstName = this.opts.firstName;
    }
    if (this.opts.lastName?.length) {
      userInput.lastName = this.opts.lastName;
    }
    this.userInput = userInput;
  }

  protected async sendRequest() {
    return network.request(mainApi, {
      uri: "/users/signup",
      method: RequestMethod.POST,
      data: this.userInput,
      description: "Sign up user",
    });
  }
}
