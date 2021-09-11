import * as yup from "yup";
import { ObjectId } from "bson";

yup.setLocale({
  mixed: {
    required: "This field is required.",
  },
  string: {
    email: "'${value} is not a valid email address.",
  },
});

/* == Additional validation methods == */
declare module "yup" {
  interface StringSchema {
    objectId(): this;
  }

  interface NumberSchema {
    propertyChange(): this;
  }
}

function objectId(this: yup.StringSchema) {
  return this.transform(function (value) {
    if (!value || ObjectId.isValid(value)) {
      return value;
    }
    throw new yup.ValidationError("Please enter a valid object ID.", value);
  });
}

function propertyChange(this: yup.NumberSchema) {
  return this.notOneOf(
    [0],
    "Change in property value cannot be 0. Enter a positive " +
      "number to add value, and a negative number to reduce value."
  );
}

yup.addMethod(yup.string, "objectId", objectId);
yup.addMethod(yup.number, "propertyChange", propertyChange);

export { yup as vschema };
