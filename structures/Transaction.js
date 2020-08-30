const GrowStocksClient = require("./GrowStocksClient");

/**
 * Represents a GrowStocks Pay transaction.
 * @constructor
 * @param {object} data - The data returned from GrowStocks Pay api.
 */
class Transaction {
  constructor (data, client) {
    /**
     * Status text - can be "Paid" or "Not Paid".
     * @type {string}
     */
    this.statusText = data.status;

    /**
     * Whether or not the transaction has been paid.
     * @type {boolean}
     */
    this.paid = data.statusInteger ? true : false;

    /**
     * The id of this transaction.
     * @type {string}
     */
    this.id = data.transaction.id;

    /**
     * The id of the user involved in this transaction.
     * @type {number}
     */
    this.userid = data.transaction.user;

    /**
     * The id of the developer account.
     * @type {number}
     */
    this.developerid = data.transaction.party;

    /**
     * The amount of wls involved in this transaction.
     * @type {number}
     */
    this.amount = data.transaction.amount;

    /**
     * The date and time transaction has been created at.
     * @type {Date}
     */
    this.createdAt = data.transaction.datetime;

    /**
     * Additional notes of the transactions.
     * @type {string}
     */
    this.notes = data.transaction.notes;

    /**
     * Client the transaction class has been instantiated by.
     * @type {GrowStocksClient}
     */
    this.client = client;
  }
}

module.exports = Transaction;