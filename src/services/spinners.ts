import ora, { Options as OraOptions } from "ora";

type StartSpinnerOptions = Omit<OraOptions, "text">;

/**
 * Start a spinner with `text` and based on `options`.
 * Return a spinner instance. The spinner will begin with a loading
 * state. Update the spinner status by calling methods from
 * the spinner instance. For example:
 * > const spinner = spinner.start(); <br/>
 * > spinner.succeed("success!");
 * @param text
 * @param options
 */
const start = (text: string, options?: StartSpinnerOptions) => {
  return ora({ text, ...options }).start();
};

export const spinners = { start };
