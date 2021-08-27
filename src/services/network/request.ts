import { AxiosInstance } from "axios";
import {
  ErrorResponse,
  RegularRequestOptions,
  SuccessResponse,
} from "../../types";
import { spinners } from "../spinners";
import { silentRequest } from "./silentRequest";
import { logError } from "./logError";

/**
 * Send a request using `instance` and based on `requestOptions`.
 * Adds a spinner based on `requestOptions.description`. Calls `silentRequest`
 * under the hood.
 * **Always resolve promise.** If an error occurred, `response.isError` will
 * be set to `true`.
 * @param instance
 * @param requestOptions
 */
export const request = async (
  instance: AxiosInstance,
  requestOptions: RegularRequestOptions
): Promise<SuccessResponse | ErrorResponse> => {
  const {
    description,
    successMsg,
    failureMsg,
    shouldClearSpinner,
    disableErrorLog,
    ...otherOptions
  } = requestOptions;

  const spinner = spinners.start(description);
  const response = await silentRequest(instance, otherOptions);

  // === Update spinner based on response
  if (!response.isError) {
    spinner.succeed(successMsg);
    if (shouldClearSpinner) {
      spinner.clear();
    }
    return response;
  }
  spinner.fail(failureMsg);
  if (!disableErrorLog) {
    logError(response);
  }
  return response;
};
