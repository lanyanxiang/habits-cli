import { QuestionCollection } from "inquirer";
import { QuestionCommand } from "../../models";
import { ErrorResponse, SecretType, SuccessResponse } from "../../types";
import { spinners, storage } from "../../services";

/** Basic authentication command blueprint to be used for commands that
 * authenticates the user and requires to store access and refresh tokens.
 * Please pass in the structure of user input (key-value) as T. */
export abstract class BasicAuthCommand<
  T extends Record<string, any>
> extends QuestionCommand<T> {
  protected abstract promptQuestions: QuestionCollection<T>;

  /** Send a request to the endpoint, using `this.userInput`, and return response. */
  protected abstract sendRequest(): Promise<SuccessResponse | ErrorResponse>;

  protected async storeAuthTokens(response: SuccessResponse) {
    const spinner = spinners.start("Persist secure session");

    const { accessToken, refreshToken } = response.data.payload!;
    try {
      await Promise.all([
        storage.secrets.set(SecretType.accessToken, accessToken),
        storage.secrets.set(SecretType.refreshToken, refreshToken),
      ]);
    } catch (error: unknown) {
      spinner.fail();
      console.error("[Error] Could not persist your session.");
      throw error;
    }

    spinner.succeed();
  }

  async run(): Promise<void> {
    await this.promptForInputs(this.promptQuestions);

    const response = await this.sendRequest();
    if (response.isError) {
      return;
    }
    await this.storeAuthTokens(response);
  }
}
