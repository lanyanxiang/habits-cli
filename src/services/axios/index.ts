import axios from "axios";
import { defaultConfig, userConfig } from "../../config";
import {
  storeTokensOnFulfill,
  storeTokensOnReject,
} from "./storeTokensInterceptor";
import { appendTokensOnFulfill } from "./appendTokensInterceptor";
import { Endpoints } from "../../types";

declare module "axios" {
  interface AxiosResponse {
    isError?: boolean;
  }

  interface AxiosError {
    isError: true;
  }
}

export const mainApi = axios.create({
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

// Determine base URL by loading in user settings.
mainApi.interceptors.request.use((config) => {
  if (!config.baseURL) {
    config.baseURL =
      Endpoints[userConfig.get("endpointName")] || defaultConfig.endpoint;
  }
  return config;
});

// Handles store and use of access / refresh tokens.
mainApi.interceptors.response.use(storeTokensOnFulfill, storeTokensOnReject);
mainApi.interceptors.request.use(appendTokensOnFulfill);
