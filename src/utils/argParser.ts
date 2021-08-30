import { InvalidArgumentError } from "commander";
import { stringParser } from "./stringParser";

// TODO Add a generic validation method that is compatible with yup / joi.

const _getFieldName = (field?: string) => (field ? field : "value");

const _throwInvalidArgumentError = (message: string) => {
  throw new InvalidArgumentError(stringParser.capitalize(message));
};

type NumberConstraint = Partial<{ min: number; max: number }>;

const checkNumericValue = (
  fieldName: string,
  value: any,
  config?: NumberConstraint
) => {
  if (isNaN(value)) {
    _throwInvalidArgumentError(`${fieldName} must be an integer.`);
  }
  if (config?.max && value > config.max) {
    _throwInvalidArgumentError(
      `${fieldName} cannot be more than ${config.max}.`
    );
  }
  if (config?.min && value < config.min) {
    _throwInvalidArgumentError(
      `${fieldName} cannot be less than ${config.min}.`
    );
  }
};

const handleInt = (field?: string, config?: NumberConstraint) => {
  const fieldName = _getFieldName(field);
  return (value: string, _: unknown) => {
    const parsedValue = parseInt(value);
    checkNumericValue(fieldName, parsedValue, config);
    return parsedValue;
  };
};

const handleFloat = (field?: string, config?: NumberConstraint) => {
  const fieldName = _getFieldName(field);
  return (value: string, _: unknown) => {
    const parsedValue = parseInt(value);
    checkNumericValue(fieldName, parsedValue, config);
    return parsedValue;
  };
};

/** Common argument parsers for command options. */
export const argParser = {
  handleInt,
  handleFloat,
};
