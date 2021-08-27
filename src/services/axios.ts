import axios from "axios";
import { config } from "../config";

declare module "axios" {
  interface AxiosError {
    isError: true;
  }
}

export const mainApi = axios.create({
  baseURL: config.baseURL,
  timeout: 20 * 1000,
});
