import { AxiosInstance } from "axios";
import {
  ErrorResponse,
  RequestMethod,
  SilentRequestConfig,
  SuccessResponse,
} from "../../types";

const _request = async (
  instance: AxiosInstance,
  requestConfig: SilentRequestConfig
) => {
  // We cannot extract this if condition check to a helper function
  // or use [...].include syntax. The explicit equality checks are
  // used in order to make TypeScript happy.
  if (
    requestConfig.method === RequestMethod.POST ||
    requestConfig.method === RequestMethod.PATCH ||
    requestConfig.method === RequestMethod.PUT
  ) {
    return await instance[requestConfig.method](
      requestConfig.uri,
      requestConfig.data,
      requestConfig.config
    );
  }
  return await instance[requestConfig.method](
    requestConfig.uri,
    requestConfig.config
  );
};

/**
 * Send a request to `instance` based on `requestConfig` silently.
 * **Always resolve promise.** If an error occurred, `response.isError` will
 * be set.
 * @param instance Instance to use.
 * @param requestConfig Configuration of request.
 */
export const silentRequest = async (
  instance: AxiosInstance,
  requestConfig: SilentRequestConfig
) => {
  let response: SuccessResponse | ErrorResponse;
  try {
    response = (await _request(instance, requestConfig)) as SuccessResponse;
  } catch (error: any) {
    response = error as ErrorResponse;
  }
  return response;
};
