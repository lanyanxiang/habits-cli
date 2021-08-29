import { LoginCommand, LogoutCommand } from "./commands/auth";
import { CommandGroup } from "./models";

const start = () => {
  const auth = new CommandGroup("auth", "authenticate").withSubcommands([
    new LoginCommand(),
    new LogoutCommand(),
  ]);
  new CommandGroup("habits", "the habits cli")
    .withSubcommands([auth])
    .init(process.argv.slice(2))
    .run();
};

start();
