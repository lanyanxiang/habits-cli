import { AuthCommand } from "./commands/auth";

console.log(process.argv);

const start = () => {
  new AuthCommand().init(process.argv.slice(2)).run();
};

start();
