import { AxiosRequestConfig } from "axios";

export enum RequestMethod {
  GET = "get",
  POST = "post",
  PATCH = "patch",
  PUT = "put",
  DELETE = "delete",
  OPTIONS = "options",
}

interface RequestOptionsBase {
  /** URI that this request should be sent to. */
  uri: string;
  method: RequestMethod;
  config?: AxiosRequestConfig;
}

export interface DataRequestOptions extends RequestOptionsBase {
  method: RequestMethod.POST | RequestMethod.PATCH | RequestMethod.PUT;
  data?: any;
}

export interface DataFreeRequestOptions extends RequestOptionsBase {
  method: RequestMethod.GET | RequestMethod.DELETE | RequestMethod.OPTIONS;
}

export type SilentRequestOptions = DataRequestOptions | DataFreeRequestOptions;

export type RegularRequestOptions = SilentRequestOptions & {
  /** Description of this request to be displayed while awaiting for response. */
  description: string;
  /** Text to display when the request is fulfilled. Or `description` if this is
   * not specified. */
  successMsg?: string;
  /** Text to display when the request fails. Or `description` if this is not
   * specified.*/
  failureMsg?: string;
  /** By default, `network.request` function reports error from `response.data.payload.error`
   * to the user. If this field is set to true, no message will be logged to the user when
   * request fails. */
  disableErrorLog?: boolean;
  /** Indicates whether the spinner should be cleared on successful request */
  shouldClearSpinner?: boolean;
};
