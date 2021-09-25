import { matchSorter } from "match-sorter";
import { RequestMethod, UserProperty } from "../../types";
import { network } from "../network";
import { mainApi } from "../axios";
import { show } from "./show";
import { AutocompleteQuestionOptions } from "inquirer-autocomplete-prompt";

const fetchProperties = async (): Promise<UserProperty[] | never> => {
  const response = await network.request(mainApi, {
    uri: "/properties",
    method: RequestMethod.GET,
    description: "Fetch your properties",
    shouldClearSpinner: true,
  });
  return response.data.payload as UserProperty[];
};

/**
 * Prompt the user to select one property from the properties that they have.
 * Return the user-selected property, or throw an appropriate error.
 */
export const selectProperty = async (
  options?: Partial<Omit<AutocompleteQuestionOptions, "type">>
): Promise<Partial<UserProperty> | never> => {
  const properties = await fetchProperties();
  const propertyNames = properties.map((property) => property.name);
  const answer = await show([
    {
      name: "propertyName",
      message: "Select a property:",
      ...options,
      type: "autocomplete",
      source: (_, input) => {
        if (!input) {
          return propertyNames;
        }
        return matchSorter(propertyNames, input);
      },
    },
  ]);
  return properties.find((property) => property.name === answer.propertyName)!;
};
