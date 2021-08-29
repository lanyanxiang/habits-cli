import { AxiosInstance } from "axios";
import { Ora } from "ora";
import {
  ErrorResponse,
  RegularRequestOptions,
  SuccessResponse,
} from "../../types";
import { spinners } from "../spinners";
import { silentRequest } from "./silentRequest";
import { logError } from "./logError";

const _handleSuccess = (
  spinner: Ora,
  requestOptions: RegularRequestOptions
) => {
  spinner.succeed(requestOptions.successMsg);
  if (requestOptions.shouldClearSpinner) {
    spinner.clear();
  }
};

const _handleFailure = (
  spinner: Ora,
  requestOptions: RegularRequestOptions,
  response: ErrorResponse
) => {
  spinner.fail(requestOptions.failureMsg);
  if (!requestOptions.disableErrorLog) {
    logError(response);
  }
};

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
  const { description, ...otherOptions } = requestOptions;

  const spinner = spinners.start(description);
  const response = await silentRequest(instance, otherOptions);

  response.isError
    ? _handleFailure(spinner, requestOptions, response)
    : _handleSuccess(spinner, requestOptions);

  return response;
};
