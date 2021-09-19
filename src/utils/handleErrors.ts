import { repository } from "../../package.json";

import { RuntimeError } from "../models";
import chalk from "chalk";

const handleSingleError = (error: any) => {
  if (error instanceof RuntimeError) {
    return console.error(chalk.red(error.serialize()));
  }
  if (error.message) {
    const _err = new RuntimeError(error.message);
    return console.error(chalk.red(_err.serialize()));
  }
  console.error(error);
  return console.error(
    chalk.red("Sorry, something went wrong. Please report this issue to ") +
      chalk.underline(chalk.bold(repository)) +
      chalk.red(".")
  );
};

export const handleErrors = (errors: any) => {};
