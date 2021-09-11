import yup, { NumberSchema, setLocale } from "yup";

setLocale({
  string: {
    email: "'${value} is not a valid email address.",
  },
});

function pointsChange(this: NumberSchema) {
  return this.notOneOf(
    [0],
    "Change in points cannot be 0. Enter a positive " +
      "number to add points, and a negative number to reduce " +
      "points."
  );
}

yup.addMethod(yup.number, "pointsChange", pointsChange);

export { yup };
