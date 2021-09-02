import { CommandGroup } from "./models";
import { auth, property, transaction } from "./commands";

// @ts-ignore
import { version } from "../package.json";

const start = () => {
  const rawArgs = process.argv.slice(2);

  // Initialize top-level command
  const habits = new CommandGroup("habits", "the habits cli")
    .withSubcommands([auth, transaction, property])
    .init(rawArgs);
  habits.version = version;
  habits.run();
};

start();
