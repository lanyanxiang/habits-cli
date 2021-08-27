export type SerializedHttpError = { message: string; cause?: string };

export interface SuccessResponse {
  success: true;
  time?: string;
  /**
   * If request is successful, some data may be returned
   * from the server. This attribute will not be set if
   * request fails.
   */
  payload?: object;
}

export interface ErrorResponse {
  success: false;
  time?: string;
  /**
   * If request results in an error, success will be set
   * to false and some error message will be returned.
   */
  errors?: SerializedHttpError[];
}
