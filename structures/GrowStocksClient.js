const RequestManager = require("../rest/RequestManager");
const Request = require("../rest/Request");
const Endpoints = require("../rest/Endpoints");
const GrowStocksUser = require("./GrowStocksUser");
const FormData = require("form-data"); 
const Transaction = require("./Transaction");
const { EventEmitter } = require("events");

/**
 * Represents a growstocks client.
 * @constructor
 * @param {string} options - Client options in JSON format.
 */
class GrowStocksClient extends EventEmitter {
  constructor (options) {
    super();
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
     * @type {string}
     */
    this.redirectURL = options.redirectURL || null;

    /**
     * Array of scopes the organisation will ask for when logging in the user.
     * @type {array[string]}
     */
    this.scopes = options.scopes.map(scope => scope.toLowerCase()) || null;

    /**
     * payRedirectURL - the url that users will be redirected to after transaction is authorized.
     * @type {string}
     */
    this.payRedirectURL = options.payRedirectURL || null; 

    /**
     * The developer's account balance.
     * @type {number}
     */
    this.balance = null;

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

  /**
   * Use a authorization token to get data on a user.
   * @param {string} authToken
   * @returns {GrowStocksUser} A GrowStocks user.
   */
  async exchangeAuthToken (authToken) {
    const body = new FormData();
    body.append("secret", this.secret);
    body.append("token", authToken);

    const exhangeRequest = new Request("post", `${Endpoints.auth.base}${Endpoints.auth.user}`, {
      body: body
    });
    const userData = await this.manager.push(exhangeRequest);

    if (userData.success) {
      return new GrowStocksUser(userData, authToken, this);
    } else {
      const errorObj = {
        error: true,
        location: `${Endpoints.auth.base}${Endpoints.auth.user}`,
        method: "post",
        reason: userData.reason,
        params: {
          token: authToken 
        }
      };
      this.emit("error", errorObj);
      return errorObj;
    }
  }

  /**
   * Returns a url encoded string to which you can redirect user for the authorization flow.
   * @returns {string} A valid url.
   */
  get authURL () {
    return `${Endpoints.OAuth.base}${Endpoints.OAuth.authorize(this.clientCode, this.scopes, this.redirectURL)}`;
  }

  /**
   * Gets data on a transaction using it's id.
   * @param {string} transactionid - The id of the transaction.
   * @returns {Transaction} A new transaction.
  */
  async getTransaction (transactionid) {
    const reqBody = new FormData();
    reqBody.append("secret", this.secret);
    reqBody.append("transaction", transactionid);

    const req = new Request("post", `${Endpoints.pay.base}${Endpoints.pay.getTransaction}`, {
      body: reqBody
    });

    const reqRes = await this.manager.push(req);

    if (reqRes.success) {
      return new Transaction(reqRes, this);
    } else {
      const errorObj = {
        error: true,
        location: `${Endpoints.pay.base}${Endpoints.pay.getTransaction}`,
        method: "post",
        reason: reqRes.reason,
        params: {
          transactionid 
        }
      };
      this.emit("error", errorObj);
      return errorObj;
    }
  }

  /**
   * Pay an user a certain amount of world locks.
   * @param {number} uid The growstocks user id of the user you want to send world locks to.
   * @param {number} amount The amount of world locks you want to send.
   * @param {string} note The note you want to include. (Optional; max 50 chars)
   * @returns {Transaction} A transaction with all the details.
   */
  async pay (uid, amount, note = "") {
    if (isNaN(uid) && isNaN(parseInt(uid))) throw new Error("The user id format you want to pay is invalid.");
    if (!this.scopes.includes("balance")) throw new Error("To use the pay function, make sure you include balance scope.");
    if (!amount || isNaN(amount)) throw new TypeError("You must provide avalid number as amount to pay.");
    if (note.length > 50) {
      note = note.split("").slice(0, 46).join(" ") + "...";
      this.client.emit("warn", `WARNING: Note for paying user with id ${this.id} (${this.name}) is larger than 50 characters (limit enforced by the api) so it's been trimed down to 50 characters.`);
    }

    const body = new FormData();
    body.append("secret", this.secret);
    body.append("party", uid);
    body.append("amount", amount);
    body.append("notes", note);

    const request = new Request("post", `${Endpoints.pay.base}${Endpoints.pay.send}`, {
      body: body
    });

    const response = await this.manager.push(request);

    if (response.success) {
      this.balance = response.balance;
      return await this.getTransaction(response.transaction);
    } else {
      const errorObj = {
        error: true,
        location: `${Endpoints.pay.base}${Endpoints.pay.send}`,
        method: "post",
        reason: response.reason,
        params: {
          uid,
          amount,
          note
        }  
      };
      this.emit("error", errorObj);
      return errorObj;
    }
  }

  /**
   * Sets the balance property of itself to the output of the API and returns it.
   */
  async getBalance () {
    const body = new FormData();
    body.append("secret", this.secret);

    const request = new Request("post", `${Endpoints.pay.base}${Endpoints.pay.balance}`, {
      body: body
    });
    const response = await this.manager.push(request);

    if (response.success) {
      this.balance = response.balance;
      return this.balance;
    } else {
      const errorObj = {
        error: true,
        location: `${Endpoints.pay.base}${Endpoints.pay.balance}`,
        method: "post",
        reason: response.reason,
        params: {}
      };
      this.emit("error", errorObj);
      return errorObj;
    }
  }
}

module.exports = GrowStocksClient;