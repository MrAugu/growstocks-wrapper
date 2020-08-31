const { FetchError } = require("./Errors");
const { parseRequestOutputToJson } = require("../utils/Rest");

class RequestManager {
  constructor () {
    this.idle = true;
    this.queue = [];
  }

  push (request) {
    return new Promise((resolve, reject) => {
      this.queueRequest({
        request,
        resolve,
        reject
      });
    });
  }

  queueRequest (request) {
    if (!this.idle) {
      this.queue.push(request);
      return this.tick();
    } else {
      return this.handle(request);
    }
  }

  tick () {
    if (this.queue.length < 1) return Promise.resolve();
    return this.handle(this.queue.shift);
  }

  async handle (requestObject) {
    const { request, resolve, reject } = requestObject;

    const response = await request.send();
    console.log(response.headers);
    if (response.ok) {
      resolve(await parseRequestOutputToJson(response));
    } else {
      const err = new FetchError(`Request to ${request.url} failed, status code ${response.status}.`, "HTTPError", response.status, request.method, request.url);
      reject(err);
    }
  }
}

module.exports = RequestManager;