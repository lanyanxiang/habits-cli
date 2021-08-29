import { CommandGroup } from "./models";
import { auth } from "./commands/auth";
import { transaction } from "./commands/transaction";

const start = () => {
  const rawArgs = process.argv.slice(2);

  // Initialize top-level command
  new CommandGroup("habits", "the habits cli")
    .withSubcommands([auth, transaction])
    .init(rawArgs)
    .run();
};

start();
