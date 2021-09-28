import { AxiosInstance } from "axios";
import {
  ErrorResponse,
  RegularRequestOptions,
  SpinnerInstance,
  SuccessResponse,
} from "../../types";
import { spinners } from "../spinners";
import { silentRequest } from "./silentRequest";
import { reportError } from "./reportError";

const _handleSuccess = (
  spinner: SpinnerInstance,
  requestOptions: RegularRequestOptions
): void => {
  if (requestOptions.shouldClearSpinner) {
    spinner.stop();
    spinner.clear();
    return;
  }
  spinner.succeed(requestOptions.successMsg);
};

const _handleFailure = (
  spinner: SpinnerInstance,
  requestOptions: RegularRequestOptions,
  response: ErrorResponse
): never => {
  spinner.fail(requestOptions.failureMsg);
  return reportError(response);
};

/**
 * Send a request using `instance` and based on `requestOptions`.
 * Adds a spinner based on `requestOptions.description`. Calls `silentRequest`
 * under the hood.
 * **Always resolve promise.** If an error occurred, a runtime error
 * will be thrown.
 * @param instance
 * @param requestOptions
 * @throws RuntimeError
 */
export const request = async (
  instance: AxiosInstance,
  requestOptions: RegularRequestOptions
): Promise<SuccessResponse | never> => {
  const { description, ...otherOptions } = requestOptions;

  const spinner = spinners.start(description);
  const response = await silentRequest(instance, otherOptions);

  if (response.isError) {
    return _handleFailure(spinner, requestOptions, response);
  }

  _handleSuccess(spinner, requestOptions);
  return response;
};
