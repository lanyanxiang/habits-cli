import { Command } from "../../models";

interface Property {
  id: string;
  name: string;
  description: string;
  amount: string;
  amountInStock: string;
}

export class ListCommand extends Command {
  name = "list";
  description = "list your properties";
  aliases = ["ls"];

  protected run(): void | Promise<void> {
    return undefined;
  }
}
