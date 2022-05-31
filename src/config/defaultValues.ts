/**
 * This is a CLI application, so we don't use environment variables.
 * While editing this file, please keep in mind that these values are
 * completely visible to the user. Do not keep secrets here!
 */
import { Endpoints } from "../types";

interface DefaultValues {
  service: string;
  endpointName: keyof typeof Endpoints;
}

export const defaultValues: DefaultValues = {
  service: "habits",
  endpointName: "test",
};
