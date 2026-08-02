import RestClient from "./RestClient";
import type Configuration from "./Configuration";

export default class BaseApi {
  protected _configuration: Configuration;
  protected _restClient: RestClient;

  constructor(configuration: Configuration) {
    this._configuration = configuration;
    this._restClient = new RestClient(configuration);
  }
}
