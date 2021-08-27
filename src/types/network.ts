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
}
