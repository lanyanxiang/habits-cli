import { Command } from "../../models";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";
import { display, mainApi, network } from "../../services";
import chalk from "chalk";

interface UserProperties {
  /** Number of points that the user has. Can be positive, negative, or 0. */
  points: number;
  /** Accumulator, recording the number of active transactions corresponding
   * to this user.*/
  numTransactions: number;
  /** Maximum num of transactions that this user can have. */
  maxTransactions: number;
}

export class ShowCommand extends Command {
  name = "show";
  description = "show your properties";

  private userProperties: UserProperties | undefined;

  private async _sendRequest(): Promise<SuccessResponse | ErrorResponse> {
    return await network.request(mainApi, {
      uri: "/properties",
      method: RequestMethod.GET,
      description: "Fetch properties",
      shouldClearSpinner: true,
    });
  }

  /** Print `this.userProperties` */
  private _printProperties() {
    if (!this.userProperties) {
      return;
    }
    const { points, numTransactions, maxTransactions } = this.userProperties;
    const table = display.table.createCompact();
    table.push(["Points", chalk.bold(chalk.cyan(points))]);
    table.push([
      "Transactions",
      chalk.bold(chalk.cyan(`${numTransactions} / ${maxTransactions}`)),
    ]);
    display.table.print(table);
  }

  async run(): Promise<void> {
    const response = await this._sendRequest();
    if (response.isError) {
      return;
    }
    this.userProperties = response.data.payload;
    this._printProperties();
  }
}
