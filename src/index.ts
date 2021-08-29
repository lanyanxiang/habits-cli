import { CommandGroup } from "./models";
import { auth } from "./commands/auth";

const start = () => {
  const rawArgs = process.argv.slice(2);

  // Initialize top-level command
  new CommandGroup("habits", "the habits cli")
    .withSubcommands([auth])
    .init(rawArgs)
    .run();
};

start();
