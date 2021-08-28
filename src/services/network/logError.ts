import { ErrorResponse } from "../../types";
import { StringParser } from "../../utils";

/**
 * Log network error to the console.
 */
export const logError = (error: ErrorResponse) => {
  const errorStatus = error.response?.status || "local";
  const errorTitle = StringParser.capitalize(
    error.response?.statusText || "An error occurred"
  );
  const errorMessages = error.response?.data.errors?.map((error) => {
    let msg = `[Error] ${error.message}`;
    if (error.cause) {
      const cause = StringParser.camelToSpaceSeparated(error.cause);
      msg += `\n> Caused by ${cause}`;
    }
    return msg;
  });

  console.log(`${errorTitle} (${errorStatus})`);
  errorMessages?.forEach((msg) => {
    console.log(msg);
  });
  if (!error.response) {
    console.log("[Error] Could not connect to the server.");
  }
};
