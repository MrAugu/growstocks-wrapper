const GrowStocksClient = require("./GrowStocksClient");

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
}

module.exports = GrowStocksUser;