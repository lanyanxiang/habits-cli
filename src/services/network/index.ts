import { silentRequest } from "./silentRequest";
import { request } from "./request";
import { reportError } from "./reportError";

export const network = {
  request,
  silentRequest,
  logError: reportError,
};
