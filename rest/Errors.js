/**
 * Represents a growstocks rest api fetch error.
 * @constructor
 * @param {string} message - The message of the error.
 */
class FetchError extends Error {
    constructor (message, name, statusCode, method, url) {
      super(message);
  
      /**
       * Name of the error.
       * @type {string}
       */
      this.name = name;
  
      /**
       * The http status code of the error.
       * @type {number}
       */
      this.code = statusCode;
  
      /**
       * The http method used to send the request.
       */
      this.method = method;
      
      /**
       * The http endpoint accessed.
       */
      this.endpoint = url;
    }
  }
  
  module.exports = {
    FetchError
  };