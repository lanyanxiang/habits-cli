import { QuestionCollection } from "inquirer";
import { Option } from "commander";
import { BasicAuthCommand } from "./BasicAuthCommand";
import { mainApi, network, validation, vschema } from "../../services";
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
    validate: validation.validator(vschema.string().email().required()),
  },
  {
    type: "password",
    name: "password",
    message: "New Password:",
    mask: "*",
    validate: validation.validator(vschema.string().required()),
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
    validate: validation.validator(vschema.string().required()),
  },
  {
    type: "input",
    name: "lastName",
    message: "Last Name:",
    validate: validation.validator(vschema.string().required()),
  },
];

export class SignUpCommand extends BasicAuthCommand<PromptAnswers> {
  name = "signup";
  description = "create a new habits account";

  protected promptQuestions = promptQuestions;

  acceptOpts = [
    new Option("-e, --email <email>", "email of new user").argParser(
      validation.argParser(vschema.string().email())
    ),
    new Option("-f, --first-name <firstName>", "first name of new user"),
    new Option("-l, --last-name <lastName>", "last name of new user"),
  ];

  protected mapOptionsToInputs() {
    this.populateInputFromOptions(["email", "firstName", "lastName"]);
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
