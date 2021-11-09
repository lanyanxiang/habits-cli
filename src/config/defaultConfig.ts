/**
 * This is a CLI application, so we don't use environment variables.
 * While editing this file, please keep in mind that these values are
 * completely visible to the user. Do not keep secrets here!
 */
import { Endpoints } from "../enums";

export const defaultConfig = {
  service: "habits",
  endpoint: Endpoints.test,
};
