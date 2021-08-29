import { AuthCommand } from "./commands/auth";

console.log(process.argv);

const start = () => {
  if (process.argv.length < 3) {
    return;
  }

  if (process.argv[2] === "auth") {
    new AuthCommand().init(process.argv.slice(3)).run();
  }
};

start();
