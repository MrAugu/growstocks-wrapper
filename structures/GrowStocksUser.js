const GrowStocksClient = require("./GrowStocksClient");
const Request = require("../rest/Request");
const Endpoints = require("../rest/Endpoints");
const FormData = require("form-data");

/**
 * Represents a growstocks user.
 * @constructor
 * @param {string} data - GrowStocks user data.
 */
class GrowStocksUser {
  constructor (data, token, client) {
    /**
     * GrowStocks user id.
     * @type {number}
     */
    this.id = data.user.id === undefined ? null : data.user.id;

    /**
     * The GrowStocks username of the user.
     * @type {string}
     */
    this.name = data.user.name === undefined ? null : data.user.name;

    /**
     * The growid of the user.
     * @type {string}
     */
    this.growid = data.user.growid === undefined ? null : data.user.growid;

    /**
     * GrowStocks Pay balance of this user.
     * @type {number}
     */
    this.balance = data.user.balance === undefined ? null : data.user.balance;

    /**
     * The authorized scopes for this user.
     * @type {array[string]}
     */
    this.scopes = data.authorizedScopes ? data.authorizedScopes.split(",") : null;

    /**
     * The authorization token for this user.
     */
    Object.defineProperty(this, "token", {
      value: token
    });

    /**
     * GrowStocksClient that instantiated this user object.
     * @type {GrowStocksClient}
     */
    this.client = client;
  }

  /**
   * 
   */
  async bill (amount, note = "") {
    if (!this.scopes.includes("balance")) throw new Error("To use the billing function, make sure you include balance scope.");
    if (!this.client.payRedirectURL) throw new Error("To use the billing function you have to include a payRedirectURL.");
    if (!amount || isNaN(amount)) throw new TypeError("You must provide avalid number as amount to bill.");
    if (note.length > 50) {
      note = note.split("").slice(0, 46).join(" ") + "...";
      this.client.emit("warn", `WARNING: Note for billing user with id ${this.id} (${this.name}) is larger than 50 characters (limit enforced by the api) so it's been trimed down to 50 characters.`);
    }

    const requestBody = new FormData();
    requestBody.append("secret", this.client.secret);
    requestBody.append("user", this.id);
    requestBody.append("amount", amount);
    requestBody.append("note", note);

    const transactionRequest = new Request("post", `${Endpoints.pay.base}${Endpoints.pay.createTransaction}`, {
      body: requestBody
    });

    const requestResponse = await this.client.manager.push(transactionRequest);
    
    if (requestResponse.success) {
      return {
        transaction: requestResponse.transaction,
        userRedirectURL: Endpoints.pay.authorize(this.client.clientCode, this.client.payRedirectURL, requestResponse.transaction)
      };
    } else {
      this.client.emit("error", {
        location: `${Endpoints.pay.base}${Endpoints.pay.createTransaction}`,
        method: "post",
        reason: requestResponse.reason,
        params: {
          user: this.id,
          amount,
          note
        }
      });
      return null;
    }
  }

  async refreshUserData () {
    const newUserData = await this.client.exchangeAuthToken(this.token);
    this.name = newUserData.name;
    this.balance = newUserData.balance;
    this.growid = newUserData.growid;
    return true;
  }
}

module.exports = GrowStocksUser;