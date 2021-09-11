import { BaseSchema } from "yup";
import { InvalidArgumentError } from "commander";

/**
 * Construct a validator function that takes a value and returns `true`
 * on validation successes, and a string stating the error on validation
 * failures.
 * @param schema Validation schema for this value. Construct this schema
 * using `vschema` exported from the `services` folder.
 */
const validator = (schema: BaseSchema) => {
  return async (value: any) => {
    try {
      await schema.validate(value);
      return true;
    } catch (error: any) {
      return error.message;
    }
  };
};

/**
 * Construct an arg parser that takes a value and casts it to the corresponding
 * type defined in `schema`. If the value cannot be parsed, throw an error that
 * is compatible with the `Command` class.
 * @param schema Validation schema for this value. Construct this schema
 * using `vschema` exported from the `services` folder.
 */
const argParser = (schema: BaseSchema) => {
  return async (value: any) => {
    try {
      await schema.validate(value);
    } catch (error: any) {
      throw new InvalidArgumentError(error.message);
    }
    return schema.cast(value);
  };
};

export const validation = { validator, argParser };
