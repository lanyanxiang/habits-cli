import { AuthCommand } from "./commands/auth";

const start = () => {
  new AuthCommand().init(process.argv.slice(2)).run();
};

start();
