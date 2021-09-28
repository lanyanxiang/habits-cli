import { BaseSchema } from "yup";
import { stringParser } from "../../utils";

/**
 * Construct a validator function that takes a value and returns `true`
 * on validation successes, and a string stating the error on validation
 * failures.
 * @param schema Validation schema for this value. Construct this schema
 * using `vschema` exported from the `services` folder.
 */
export const validator = (schema: BaseSchema) => {
  return (value: any) => {
    try {
      schema.validateSync(value);
      return true;
    } catch (error: any) {
      return stringParser.capitalize(error.message);
    }
  };
};
