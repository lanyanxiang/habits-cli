import { AxiosRequestConfig } from "axios";
import { storage } from "../storage";
import { SecretType } from "../../types";

export const appendTokensOnFulfill = async (
  requestConfig: AxiosRequestConfig
) => {
  // Get tokens
  let accessToken;
  let refreshToken;
  try {
    accessToken = await storage.secrets.get(SecretType.accessToken);
    refreshToken = await storage.secrets.get(SecretType.refreshToken);
  } catch (_) {}

  // Append headers
  requestConfig.headers["authorization"] = `bearer ${accessToken}`;
  requestConfig.headers["x-refresh-token"] = `refresh ${refreshToken}`;
  return requestConfig;
};
