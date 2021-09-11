import * as vschema from "yup";

vschema.setLocale({
  mixed: {
    required: "This field is required.",
  },
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

function propertyChange(this: vschema.NumberSchema) {
  return this.notOneOf(
    [0],
    "Change in property value cannot be 0. Enter a positive " +
      "number to add value, and a negative number to reduce value."
  );
}

vschema.addMethod(vschema.number, "propertyChange", propertyChange);

export { vschema };
