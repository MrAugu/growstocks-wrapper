const { GrowStocksClient } = require("./index");
const Keys = require("./keys.json");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser());

const GSClient = new GrowStocksClient({
  organisation: Keys.organisation,
  url: Keys.url,
  clientCode: Keys.clientCode,
  secret: Keys.secret,
  redirectURL: Keys.redirectURL,
  scopes: ["profile", "balance"]
});

app.get("/login", async (req, res) => {
  res.redirect(GSClient.authURL);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;
  const GSUser = await GSClient.exchangeAuthToken(code);
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(GSUser, null, 4));
  console.log(GSUser);
});

app.listen(3030);