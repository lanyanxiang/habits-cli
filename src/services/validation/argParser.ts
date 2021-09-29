import { BaseSchema } from "yup";
import { InvalidArgumentError } from "commander";
import { stringParser } from "../../utils";

/**
 * Construct an arg parser that takes a value and casts it to the corresponding
 * type defined in `schema`. If the value cannot be parsed, throw an error that
 * is compatible with the `Command` class.
 * @param schema Validation schema for this value. Construct this schema
 * using `vschema` exported from the `services` folder.
 */
export const argParser = (schema: BaseSchema) => {
  return (value: any) => {
    // Inquirer returns an empty string when the user simply presses enter
    // without entering anything. Commander do the same in option values.
    // As of this issue https://github.com/lanyanxiang/habits-cli/issues/25,
    // for easier parsing & convention, we will return `null` when an empty
    // string is processed regardless of schema.
    if (typeof value === "string" && !value) {
      return null;
    }

    try {
      schema.validateSync(value);
    } catch (error: any) {
      throw new InvalidArgumentError(stringParser.capitalize(error.message));
    }
    return schema.cast(value);
  };
};
