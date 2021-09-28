import { ErrorResponse } from "../../types";
import { stringParser } from "../../utils";
import { RuntimeError } from "../../models";

/**
 * Analyze network error `error` and throw the corresponding
 * `RuntimeError` object / array.
 * @throws RuntimeError
 * @see RuntimeError
 */
export const reportError = (error: ErrorResponse): never => {
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
