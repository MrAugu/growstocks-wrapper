const RequestManager = require("../rest/RequestManager");
const Request = require("../rest/Request");
const Endpoints = require("../rest/Endpoints");
const GrowStocksUser = require("./GrowStocksUser");

/**
 * Represents a growstocks client.
 * @constructor
 * @param {string} options - Client options in JSON format.
 */
class GrowStocksClient {
  constructor (options) {
    if (!options) throw new Error("You must include credentials as options.");

    /**
     * The name of growstocks developer organisation.
     * @type {string}
     */
    this.organisation = options.organisation || null;

    /**
     * GrowStocks organisation url.
     * @type {string}
     */
    this.url = options.url || null;

    /**
     * GrowStocks client code.
     * @type {string}
     */
    this.clientCode = options.code || null;

    /**
     * GrowStocks secret token.
     * @type {string}
     */
    Object.defineProperty(this, "secret", options.secret);

    /**
     * This growstocks client's request manager.
     * @type {RequestManager}
     */
    this.manager = new RequestManager();

    /**
     * This growstocks client's redirect url.
     */
    this.redirectURL = options.redirectURL || null;

    if ([
      this.organisation,
      this.url,
      this.clientCode,
      this.secret,
      this.redirectURL
    ].some(property => property === null)) throw new TypeError("You must provide valid options keys (organisation, url, clientCode, secret, redirectURL) within the GrowStocksClient constructor.");
  }

  async exchangeAuthToken (authToken) {
    const exhangeRequest = new Request("post", `${Endpoints.auth.base}${Endpoints.auth.user}`, {
      body: {
        "secret": this.secret,
        "token": authToken
      }
    });

    const userData = await this.manager.push(exhangeRequest);
    return new GrowStocksUser(userData, authToken, this);
  }
}

module.exports = GrowStocksClient;