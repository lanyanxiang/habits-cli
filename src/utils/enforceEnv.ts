/**
 * Check if the required and optional environment variables are present.
 * If some required environment variables are not present, throw an error
 * and terminate the program.
 * If some optional environment variables are not present, fill the variables
 * with default values.
 */

const requiredVariables = [];
// A mapping between variable name and the default value to populate if not present.
const optionalVariables = {
  API_ENDPOINT: "http://localhost:5000/api/v1",
};
