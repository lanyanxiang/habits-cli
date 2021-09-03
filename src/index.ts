// @ts-ignore
import { version } from "../package.json";

import { CommandGroup } from "./models";
import { auth, property, transaction } from "./commands";
import { invitation } from "./commands/invitation";

const start = () => {
  const rawArgs = process.argv.slice(2);

  // Initialize top-level command
  const habits = new CommandGroup("habits", "the habits cli").withSubcommands([
    auth,
    transaction,
    property,
    invitation,
  ]);
  habits.version = version;
  habits.showHelpAfterError = true;
  habits.init(rawArgs).run();
};

start();
