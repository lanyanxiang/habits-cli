import { RequestMethod, UserProperty } from "../../types";
import { network } from "../network";
import { mainApi } from "../axios";

const fetchProperties = async (): Promise<UserProperty[] | undefined> => {
  const response = await network.request(mainApi, {
    uri: "/properties",
    method: RequestMethod.GET,
    description: "Fetch your properties",
    shouldClearSpinner: true,
  });
  if (response.isError) {
    return;
  }
  return response.data.payload as UserProperty[];
};

/**
 * Prompt the user to select one property from the properties that they have.
 * Return the user-selected property.
 */
export const selectProperty = async (): Partial<UserProperty> => {};
