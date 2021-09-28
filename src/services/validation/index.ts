import { validator } from "./validator";
import { argParser } from "./argParser";
import { schema } from "./validationSchema";

export const validation = {
  validator,
  argParser,
  schema,
};

// Alias `validation.schema`.
export const vschema = schema;
