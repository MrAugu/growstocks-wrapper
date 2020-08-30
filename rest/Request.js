const fetch = require("node-fetch");

class Request {
  constructor (method, url, options = {}) {
    /**
     * The method to use for this request.
     * @type {string}
     */
    this.method = method;

    /**
     * The url to send request to.
     * @type {string}
     */
    this.url = url;

    /**
     * The body of the request.
     * @type {object}
     */
    this.body = options.body || {};

    /**
     * The headers for this request.
     * @type {object}
     */
    this.headers = options.headers || {};

    
    if (!this.headers["User-Agent"]) Object.assign(this.headers, {
        "User-Agent": `GrowLancer (https://growlancer.xyz/, 0.0.1)`
    });
  }

  async send() {
    console.log(this.body);
    const requestOptions = {
      "method": this.method,
      "headers": this.headers
    };

    if (!["get", "head"].includes(this.method)) requestOptions.body = JSON.stringify(this.body);
  
    return fetch(this.url, requestOptions);
  }
}

module.exports = Request;