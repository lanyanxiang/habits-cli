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
): Promise<SuccessResponse | ErrorResponse> => {
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
