export const validation = {
  isEmail: (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
};

export const requiredValidator = (input: string | undefined) => {
  if (input?.length) {
    return true;
  }
  return "Please enter a value.";
};

export const pointsChangeValidator = (input: any) => {
  if (isNaN(Number(input))) {
    return "Please enter a valid number.";
  }
  if (Number(input) != 0) {
    return true;
  }
  return (
    "Change in points cannot be 0. Enter a positive " +
    "number to add points, and a negative number to reduce " +
    "points."
  );
};
