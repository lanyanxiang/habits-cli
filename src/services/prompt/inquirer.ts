import inquirer from "inquirer";
import autocompletePrompt from "inquirer-autocomplete-prompt";

inquirer.registerPrompt("autocomplete", autocompletePrompt);

export { inquirer };
