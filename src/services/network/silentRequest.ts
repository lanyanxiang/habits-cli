import { AxiosInstance } from "axios";
import {
  ErrorResponse,
  RequestMethod,
  SilentRequestOptions,
  SuccessResponse,
} from "../../types";

const _request = async (
  instance: AxiosInstance,
  requestOptions: SilentRequestOptions
) => {
  // We cannot extract this if condition check to a helper function
  // or use [...].include syntax. The explicit equality checks are
  // used in order to make TypeScript happy.
  if (
    requestOptions.method === RequestMethod.POST ||
    requestOptions.method === RequestMethod.PATCH ||
    requestOptions.method === RequestMethod.PUT
  ) {
    return await instance[requestOptions.method](
      requestOptions.uri,
      requestOptions.data,
      requestOptions.config
    );
  }
  return await instance[requestOptions.method](
    requestOptions.uri,
    requestOptions.config
  );
};

/**
 * Send a request to `instance` based on `requestOptions` silently.
 * **Always resolve promise.** If an error occurred, `response.isError` will
 * be set.
 * @param instance Instance to use.
 * @param requestOptions Configuration of request.
 */
export const silentRequest = async (
  instance: AxiosInstance,
  requestOptions: SilentRequestOptions
) => {
  let response: SuccessResponse | ErrorResponse;
  try {
    response = (await _request(instance, requestOptions)) as SuccessResponse;
  } catch (error: any) {
    response = error as ErrorResponse;
  }
  return response;
};
