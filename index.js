module.exports = {
  rest: {
    Endpoints: require("./rest/Endpoints"),
    Errors: require("./rest/Errors"),
    Request: require("./rest/Request"),
    RequestManager: require("./rest/RequestManager")
  },
  GrowStocksClient: require("./structures/GrowStocksClient"),
  GrowStocksUser: require("./structures/GrowStocksUser")
}