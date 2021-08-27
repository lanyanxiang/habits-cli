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
