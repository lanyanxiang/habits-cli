import { Command } from "commander";

const program = new Command("habits");
program.version("0.0.1");

// Example options
program.option("-d, --description", "display a description of this cli");

program.parse(process.argv);

const options = program.opts();
if (options.description) {
  console.log("A habits cli.");
}
console.log("Bye!");
