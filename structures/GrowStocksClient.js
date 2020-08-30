const RequestManager = require("../rest/RequestManager");
const Request = require("../rest/Request");
const Endpoints = require("../rest/Endpoints");
const GrowStocksUser = require("./GrowStocksUser");
const FormData = require("form-data"); 

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
    this.clientCode = options.clientCode || null;

    /**
     * GrowStocks secret token.
     * @type {string}
     */
    Object.defineProperty(this, "secret", {
      value: options.secret
    });

    /**
     * This growstocks client's request manager.
     * @type {RequestManager}
     */
    this.manager = new RequestManager();

    /**
     * This growstocks client's redirect url.
     */
    this.redirectURL = options.redirectURL || null;

    /**
     * Array of scopes the organisation will ask for when logging in the user.
     * @type {array[string]}
     */
    this.scopes = options.scopes.map(scope => scope.toLowerCase()) || null;

    if ([
      this.organisation,
      this.url,
      this.clientCode,
      this.secret,
      this.redirectURL,
      this.scopes
    ].some(property => property === null)) throw new TypeError("You must provide valid options keys (organisation, url, clientCode, secret, redirectURL, scopes) within the GrowStocksClient constructor.");

    for (const scope of this.scopes) {
      if (!["email", "profile", "balance"].includes(scope)) throw new TypeError(`Invalid scope ${scope} provided. Valid scopes are email, profile, balance.`);
      else continue;
    }

    if (this.scopes.includes("balance") && this.scopes.length < 2) throw new TypeError("The balance scope must be used with either profile or email scopes.");
  }

  async exchangeAuthToken (authToken) {
    const body = new FormData();
    body.append("secret", this.secret);
    body.append("token", authToken);

    const exhangeRequest = new Request("post", `${Endpoints.auth.base}${Endpoints.auth.user}`, {
      body: body
    });
    const userData = await this.manager.push(exhangeRequest);

    return new GrowStocksUser(userData, authToken, this);
  }

  get authURL () {
    return `${Endpoints.OAuth.base}${Endpoints.OAuth.authorize(this.clientCode, this.scopes, this.redirectURL)}`;
  }
}

module.exports = GrowStocksClient;