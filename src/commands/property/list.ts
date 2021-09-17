import { Command } from "../../models";

interface Property {
  id: string;
  name: string;
  description: string;
  amount: string;
  amountInStock: string;
}

export class ListCommand extends Command {}
