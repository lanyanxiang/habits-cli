import { AxiosInstance } from "axios";

export interface RequestConfig {
  /** The URI to request to. */
  uri: string;
  /** Instance to use. */
  instance: AxiosInstance;
  /** Message to display when awaiting response. */
  loadingMsg?: string;
}
