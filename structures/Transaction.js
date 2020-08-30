const GrowStocksClient = require("./GrowStocksClient");

/**
 * Represents a GrowStocks Pay transaction.
 * @constructor
 * @param {object} data - The data returned from GrowStocks Pay api.
 */
class Transaction {
  constructor (data, client) {
     /**
     * The type of transaction, can be "send" or "receive".
     * @type {string}
     */
    this.type = data.transaction.action === 5 ? "receive" : "send";

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
    this.userid = this.type === "receive" ? data.transaction.user : data.transaction.party;

    /**
     * The id of the developer account.
     * @type {number}
     */
    this.developerid = this.type === "receive" ? data.transaction.party : data.transaction.user;

    /**
     * The amount of wls involved in this transaction.
     * @type {number}
     */
    this.amount = data.transaction.amount;

    /**
     * The date and time transaction has been created at.
     * @type {Date}
     */
    this.createdAt = new Date(data.transaction.datetime);

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