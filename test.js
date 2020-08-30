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
  payRedirectURL: Keys.payRedirectURL,
  scopes: ["profile", "balance"]
});

GSClient.on("error", (errorObj) => {
  console.log(errorObj);
});

GSClient.on("warn", (warning) => {
  console.log(warning);
});

GSClient.getBalance().then(console.log);
//GSClient.pay(9, 1, "Kisses.").then(console.log);

app.get("/login", async (req, res) => {
  res.redirect(GSClient.authURL);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;
  const GSUser = await GSClient.exchangeAuthToken(code);
  const transaction = await GSUser.bill(1);
  res.redirect(transaction.userRedirectURL);
});

app.get("/payments", async (req, res) => {
  const transactionID = req.query.transaction;
  const transaction = await GSClient.getTransaction(transactionID);
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(transaction, null, 4));
  console.log(transaction);
  await GSClient.getTransaction("fsgfe");
});

app.listen(3030);