import axios, { AxiosResponse } from "axios";
import { config } from "../../config";
import { ErrorPayload, ErrorResponse, SuccessResponse } from "../../types";

declare module "axios" {
  interface AxiosResponse {
    isError?: boolean;
  }

  interface AxiosError {
    isError: true;
  }
}

export const mainApi = axios.create({
  baseURL: config.baseURL,
  timeout: 20 * 1000,
});

// Set `isError` on return object.
mainApi.interceptors.response.use(
  (response) => {
    response.isError = false;
    return response;
  },
  (error) => {
    error.isError = true;
    return Promise.reject(error);
  }
);

// Handle X-Refresh-Token and X-Access-Token in response header.
// See https://lanyanxiang.github.io/node-authentication-starter/#/api/authentication.
const _storeTokens = async <T extends SuccessResponse | ErrorResponse>(
  _response: T
): Promise<T> => {
  const response:
    | AxiosResponse<ErrorPayload>
    | SuccessResponse
    | undefined = _response.isError ? _response.response : _response;

  if (!response?.headers) {
    return _response;
  }
  if ("x-access-token" in response.headers) {
    console.log("Received x-access-token", response.headers["x-access-token"]);
  }
  if ("x-refresh-token" in response.headers) {
    console.log(
      "Received x-refresh-token",
      response.headers["x-refresh-token"]
    );
  }

  return _response;
};
mainApi.interceptors.response.use(
  async (response) =>
    await _storeTokens<SuccessResponse>(response as SuccessResponse),
  (error) => _storeTokens<ErrorResponse>(error)
);
