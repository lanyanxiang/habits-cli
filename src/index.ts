import { CommandGroup } from "./models";
import { auth, property, transaction } from "./commands";

const start = () => {
  const rawArgs = process.argv.slice(2);

  // Initialize top-level command
  new CommandGroup("habits", "the habits cli")
    .withSubcommands([auth, transaction, property])
    .init(rawArgs)
    .run();
};

start();
