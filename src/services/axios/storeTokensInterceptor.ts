import {
  ErrorPayload,
  ErrorResponse,
  SecretType,
  SuccessResponse,
} from "../../types";
import { AxiosError, AxiosResponse } from "axios";
import { storage } from "../storage";

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
    await storage.secrets.set(
      SecretType.accessToken,
      response.headers["x-access-token"]
    );
  }
  if ("x-refresh-token" in response.headers) {
    await storage.secrets.set(
      SecretType.refreshToken,
      response.headers["x-refresh-token"]
    );
  }

  return _response;
};

export const storeTokensOnFulfill = async (response: AxiosResponse) =>
  await _storeTokens<SuccessResponse>(response as SuccessResponse);

export const storeTokensOnReject = async (error: AxiosError) =>
  await _storeTokens<ErrorResponse>(error);
