import yup, { setLocale } from "yup";

setLocale({
  string: {
    email: "'${value} is not a valid email address.",
  },
});

export { yup };
