import inquirer, { Answers } from "inquirer";
import autocompletePrompt, {
  AutocompleteQuestionOptions,
} from "inquirer-autocomplete-prompt";

declare module "inquirer" {
  interface QuestionMap<T extends Answers = Answers> {
    autocomplete: AutocompleteQuestionOptions<T>;
  }
}

inquirer.registerPrompt("autocomplete", autocompletePrompt);

export { inquirer };
