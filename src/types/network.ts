import { AxiosRequestConfig } from "axios";

export enum RequestMethod {
  GET = "get",
  POST = "post",
  PATCH = "patch",
  PUT = "put",
  DELETE = "delete",
  OPTIONS = "options",
}

interface RequestConfigBase {
  /** URI that this request should be sent to. */
  uri: string;
  method: RequestMethod;
  config: AxiosRequestConfig;
}

export interface DataRequestConfig extends RequestConfigBase {
  method: RequestMethod.POST | RequestMethod.PATCH | RequestMethod.PUT;
  data?: any;
}

export interface DataFreeRequestConfig extends RequestConfigBase {
  method: RequestMethod.GET | RequestMethod.DELETE | RequestMethod.OPTIONS;
}

export type SilentRequestConfig = DataRequestConfig | DataFreeRequestConfig;

export type RegularRequestConfig = SilentRequestConfig & {
  /** Description of this request to be displayed while awaiting for response. */
  description: string;
  /** Text to display when the request is fulfilled. Or `description` if this is
   * not specified. */
  successMsg?: string;
  /** Text to display when the request fails. Or `description` if this is not
   * specified.*/
  failureMsg?: string;
};
