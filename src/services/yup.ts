import yup, { NumberSchema, setLocale } from "yup";

setLocale({
  string: {
    email: "'${value} is not a valid email address.",
  },
});

/* == Additional validation methods == */
declare module "yup" {
  interface NumberSchema {
    propertyChange(): this;
  }
}

function propertyChange(this: NumberSchema) {
  return this.notOneOf(
    [0],
    "Change in property value cannot be 0. Enter a positive " +
      "number to add value, and a negative number to reduce value."
  );
}

yup.addMethod(yup.number, "pointsChange", propertyChange);

export { yup };
