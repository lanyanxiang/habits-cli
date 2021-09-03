import { Command } from "../../models";
import { ErrorResponse, RequestMethod, SuccessResponse } from "../../types";
import { mainApi, network } from "../../services";
import chalk from "chalk";

export class ShowCommand extends Command {
  name = "show";
  description = "show your personal code of invitation";

  private async _sendRequest(): Promise<SuccessResponse | ErrorResponse> {
    return await network.request(mainApi, {
      uri: "/invitations/code",
      method: RequestMethod.GET,
      description: "Fetch invitation code",
    });
  }

  async run(): Promise<void> {
    const response = await this._sendRequest();
    if (response.isError) {
      return;
    }
    console.log(
      "Your invitation code: ",
      chalk.green(response.data.payload.code)
    );
  }
}
