import { RuntimeError } from "../models";
import chalk from "chalk";

const handleSingleError = (error: unknown) => {
  if (error instanceof RuntimeError) {
    console.error(chalk.red(error.serialize()));
  }
};

export const handleErrors = (errors: unknown) => {};
