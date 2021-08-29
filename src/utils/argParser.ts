import { InvalidArgumentError } from "commander";

const _getFieldName = (field?: string) => (field ? field : "value");

const handleInt = (
  field?: string,
  config?: Partial<{ min: number; max: number }>
) => {
  return (value: string, _: unknown) => {
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue)) {
      throw new InvalidArgumentError(``);
    }
    if (config?.max && parsedValue > config.max) {
      throw new InvalidArgumentError("Value must be ");
    }
  };
};

/** Common argument parsers for command options. */
export const argParser = {};
