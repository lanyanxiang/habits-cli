import { Command } from "commander";
import { AuthCommand } from "./commands/auth";

console.log(process.argv);

const start = () => {
  if (process.argv.length < 3) {
    return;
  }

  if (process.argv[2] === "auth") {
    const command = new AuthCommand(new Command(), process.argv.slice(3));
    command.run();
  }
};

start();
