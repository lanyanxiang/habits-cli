import { RequestMethod, UserProperty } from "../../types";
import { network } from "../network";
import { mainApi } from "../axios";

const fetchProperties = async () => {
  return await network.request(mainApi, {
    uri: "/properties",
    method: RequestMethod.GET,
    description: "Fetch your properties",
    shouldClearSpinner: true,
  });
};

/**
 * Prompt the user to select one property from the properties that they have.
 * Return the user-selected property.
 */
export const selectProperty = async (): Partial<UserProperty> => {};
