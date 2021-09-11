import * as yup from "yup";

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
  interface StringScchema {
    objectId(): this;
  }

  interface NumberSchema {
    propertyChange(): this;
  }
}

function propertyChange(this: yup.NumberSchema) {
  return this.notOneOf(
    [0],
    "Change in property value cannot be 0. Enter a positive " +
      "number to add value, and a negative number to reduce value."
  );
}

yup.addMethod(yup.number, "propertyChange", propertyChange);

export { yup as vschema };
