import ora, { Options as OraOptions } from "ora";

type StartSpinnerOptions = Omit<OraOptions, "text">;

const start = (text: string, options: StartSpinnerOptions) => {
  return ora({ text, ...options }).start();
};

export const spinner = { start };
