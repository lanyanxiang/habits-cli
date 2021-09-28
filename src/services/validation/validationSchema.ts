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
    /** Represents a change in property amount. */
    propertyChange(): this;

    /** Limit parameter for pagination with habits-restapi. */
    pageLimit(): this;

    /** Skip parameter for pagination with habits-restapi. */
    pageSkip(): this;
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
    "Change in property amount cannot be 0. Enter a positive " +
      "number to add amount, and a negative number to reduce amount."
  );
}

function pageLimit(this: yup.NumberSchema) {
  return this.label("limit").integer().min(1);
}

function pageSkip(this: yup.NumberSchema) {
  return this.label("skip").integer().min(1);
}

yup.addMethod(yup.string, "objectId", objectId);
yup.addMethod(yup.number, "propertyChange", propertyChange);
yup.addMethod(yup.number, "pageLimit", pageLimit);
yup.addMethod(yup.number, "pageSkip", pageSkip);

export { yup as schema };
