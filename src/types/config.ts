export enum Endpoints {
  test = "http://habits.test.jimmy-lan.com/api/v1",
  local = "http://localhost:5000/api/v1",
}

export interface UserConfig {
  /** Name of endpoint to send requests to. */
  endpointName: keyof typeof Endpoints;
}
