import { ErrorResponse } from "../../types";
import { stringParser } from "../../utils";
import chalk from "chalk";
import { RuntimeError } from "../../models";

/**
 * Log network error to the console.
 */
export const logError = (error: ErrorResponse) => {
  const errorStatus = error.response?.status || "local";
  const errorTitle = stringParser.capitalize(
    error.response?.statusText || "An error occurred"
  );
  console.log(chalk.red(chalk.bold(`${errorTitle} (${errorStatus})`)));

  const errorsToThrow = error.response?.data.errors?.map((error) => {
    return new RuntimeError(error.message).withCause(error.cause);
    let msg = `[Error] ${error.message}`;
    if (error.cause) {
      const cause = stringParser.camelToSpaceSeparated(error.cause);
      msg += `\n> Caused by ${cause}`;
    }
    return msg;
  });
  errorMessages?.forEach((msg) => {
    console.log(msg);
  });
  if (!error.response) {
    console.log("[Error] Could not connect to the server.");
  }
};
