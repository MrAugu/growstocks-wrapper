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
    this.id = data.id || null;

    /**
     * The GrowStocks username of the user.
     * @type {string}
     */
    this.name = data.name || null;

    /**
     * The growid of the user.
     * @type {string}
     */
    this.growid = data.growid || null;

    /**
     * GrowStocks Pay balance of this user.
     * @type {number}
     */
    this.balance = data.balance || null;

    /**
     * The authorized scopes for this user.
     * @type {array[string]}
     */
    this.scopes = data.authorizedScopes ? data.authorizedScopes.split(",") : null;

    /**
     * The authorization token for this user.
     */
    this.token = token;

    /**
     * GrowStocksClient that instantiated this user object.
     * @type {GrowStocksClient}
     */
    this.client = client;
  }
}

module.exports = GrowStocksUser;