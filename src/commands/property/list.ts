import { Command } from "../../models";
import { Option } from "commander";
import chalk from "chalk";
import { display, mainApi, network, validation, vschema } from "../../services";
import { RequestMethod, SuccessResponse, UserProperty } from "../../types";

const displaySingleProperty = (property: UserProperty) => {
  const { id, name, description, amount, amountInStock } = property;
  console.log(chalk.cyan(chalk.bold(`Property "${name}" (${id})`)));
  if (description) {
    console.log(chalk.bold("Description: ") + description);
  }
  console.log();
  const table = display.table.createCompact();
  table.push(["Name", name]);
  table.push(["Amount", amount]);
  if (amountInStock !== undefined) {
    table.push(["In Stock", amountInStock]);
  }
  display.table.print(table);
  console.log();
};

const displayProperties = (properties: UserProperty[]) => {
  if (!properties.length) {
    return console.log("Listed 0 properties.");
  }
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

  private async _sendRequest(): Promise<SuccessResponse> {
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
    const properties = response.data.payload as UserProperty[];
    displayProperties(properties);
  }
}
