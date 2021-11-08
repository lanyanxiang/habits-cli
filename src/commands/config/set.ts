import { Command } from "../../models";
import { storage } from "../../services";

export class SetCommand extends Command {
  name = "set";
  description = "set a configuration";

  protected run(): void | Promise<void> {
    console.log(storage.local.get("hi/there"));
    return undefined;
  }
}
