import { QuestionCommand } from "../../../models";
import { Argument } from "commander";
import { validation, vschema } from "../../../services";
import { matchSorter } from "match-sorter";
import { Endpoints } from "../../../enums";
import { UserConfig, userConfig } from "../../../config";

interface PromptAnswers {
  endpointName: UserConfig["endpointName"];
}

export class SetEndpointCommand extends QuestionCommand<PromptAnswers> {
  name = "endpoint";
  description = "set the endpoint that the habits client requests to";

  acceptArgs = [
    new Argument("name", "name of the endpoint to use")
      .argOptional()
      .argParser(
        validation.argParser(vschema.string().oneOf(Object.keys(Endpoints)))
      ),
  ];

  protected mapArgumentsToInputs(): void | Promise<void> {
    if (this.args.length > 0) {
      this.userInput.endpointName = this.args[0] as UserConfig["endpointName"];
    }
  }

  private async _askForInput(): Promise<void> {
    const endpointsToSelect = Object.keys(Endpoints);

    await this.promptForInputs([
      {
        name: "endpointName",
        message: "Which endpoint would you like to use?",
        type: "autocomplete",
        source: (_, input) => {
          if (!input) {
            return endpointsToSelect;
          }
          return matchSorter(endpointsToSelect, input);
        },
      },
    ]);
  }

  protected async run(): Promise<void> {
    await this._askForInput();
    userConfig.set("endpointName", this.userInput.endpointName!);
  }
}
