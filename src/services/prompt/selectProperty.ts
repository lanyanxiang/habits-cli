import { RequestMethod, UserProperty } from "../../types";
import { network } from "../network";
import { mainApi } from "../axios";
import { show } from "./show";

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
 * Return the user-selected property, or `undefined` if an error occurred.
 */
export const selectProperty = async (
  message?: string
): Promise<Partial<UserProperty> | undefined> => {
  const properties = await fetchProperties();
  if (!properties) {
    return;
  }
  const answer = await show([
    {
      type: "autocomplete",
      name: "propertyId",
      message: message || "Select a property:",
      source:,
    },
  ]);
};
