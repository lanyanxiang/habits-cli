import { Command } from "../../models";
import { Option } from "commander";
import chalk from "chalk";
import { display, mainApi, network, validation, vschema } from "../../services";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";

interface Property {
  id: string;
  name: string;
  description?: string;
  amount: string;
  amountInStock?: string;
}

const displaySingleProperty = (property: Property) => {
  const { id, name, description, amount, amountInStock } = property;
  console.log(chalk.cyan(chalk.bold(`Property "${name}" (${id})`)));
  if (description) {
    console.log(chalk.bold("Description: ") + description);
  }
  console.log();
  const table = display.table.createCompact();
  table.push(["Name", name]);
  table.push(["Amount", amount]);
  if (amountInStock) {
    table.push(["In Stock", amountInStock]);
  }
  display.table.print(table);
  console.log();
};

const displayProperties = (properties: Property[]) => {
  properties.forEach((property) => {
    displaySingleProperty(property);
  });
};

export class ListCommand extends Command {
  name = "list";
  description = "list your properties";
  aliases = ["ls"];

  acceptOpts = [
    new Option("-s, --skip <skip>", "number of properties to skip").argParser(
      validation.argParser(vschema.number().pageSkip())
    ),
    new Option(
      "-l, --limit <limit>",
      "number of properties to display"
    ).argParser(validation.argParser(vschema.number().pageLimit())),
  ];

  private async _sendRequest(): Promise<SuccessResponse | ErrorResponse> {
    const skip = this.opts.skip;
    const limit = this.opts.limit;

    return await network.request(mainApi, {
      uri: "/properties",
      method: RequestMethod.GET,
      config: {
        params: {
          skip,
          limit,
        },
      },
      description: "Fetch properties",
      shouldClearSpinner: true,
    });
  }

  protected async run(): Promise<void> {
    const response = await this._sendRequest();
    if (response.isError) {
      return;
    }
    const properties = response.data.payload as Property[];
    displayProperties(properties);
  }
}
