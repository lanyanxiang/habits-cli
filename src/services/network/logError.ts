import { ErrorResponse } from "../../types";
import { stringParser } from "../../utils";
import { RuntimeError } from "../../models";

/**
 * Log network error to the console.
 * @throws RuntimeError
 */
export const logError = (error: ErrorResponse) => {
  const errorStatus = error.response?.status || "local";
  const errorTitle = stringParser.capitalize(
    error.response?.statusText || "An error occurred"
  );
  console.log(`${errorTitle} (${errorStatus})`);

  if (!error.response) {
    throw new RuntimeError("Could not connect to the server.");
  }

  throw error.response?.data.errors?.map((error) => {
    return new RuntimeError(error.message).withCause(error.cause);
  });
};
