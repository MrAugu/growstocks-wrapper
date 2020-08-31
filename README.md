# growstocks-wrapper
A fully-fledged GrowStocks OAuth &amp; Pay API wrapper.

# Examples
**1) Instantiating a GrowStocksClient**

*Instantiating a client is necessary in order to access the API.*

```js
const { GrowStocksClient } = require("growstocks-wrapper");

const client = new GrowStocksClient({
  organisation: "GrowStocks", // REQUIRED: Your growstocks organisation organisation name.
  url: "growstocks.xyz", // REQUIRED: Your growstocks developer organisation url.
  clientCode: "234626384914568257", // REQUIRED: Your growstocks developer client code.
  secret: "3%go@wRtDRfF5693#$jj4hJA5J3!ImNDJ", // REQUIRED: Your growstocks developer secret.
  redirectURL: "http://localhost:3030/callback", // REQUIRED: One of urls you added as valid growstocks redirect urls in developer dashboard used for authentication flow.
  payRedirectURL: "http://localhost:3030/payments", // OPTIONAL (In order to use GrowStocks Pay you have to specify one): One of urls you added as valid growstocks redirect urls in developer dashboard used for transaction authorization flow.
  scopes: ["profile", "balance"] // REQUIRED: Different scopes. Available scopes: "profile", "balance", "email".
 });
 ```

**2) Authorization flow with express.**

*Re-directs and retrives user data after authorization process using `express`. (Session data storing not included.)
```js
const express = require("express");
const app = expresss();

app.get("/login", (request, response) => {
  response.redirect(client.authURL);
});

app.get("/callback", async (request, response) => {
  const authorizationCode = request.query.code;
  const authorizedUser = await client.exchangeAuthToken(authorizationCode);
  console.log(authorizedUser);
});

app.listen(3030);
```

# Documentation

**1) GrowSotkcsClient Class**

**Properties**

Properties: `organisation`, `url`, `clientCode`, `secret`, `redirectURL`, `scopes`, `manager`, `payRedirectURL`, `balance`.

`organisation <string>` - The name of your growstocks developer organisation.

`url <string>` - The url of your growstocks developer organisation.

`clientCode <string>` - The client code of your growstocks developer organisation.

`secret <string>` - The secret of your growstocks developer organisation.

`redirectURL <string>` - The url users are redirected to after authorizing access in growstock's oauth.

`scopes <array[string]>` - Information GrowStocks is asked for while authorizing.

`manager <RequestManager>` - Wrapper's internal `RequestManager`, used internally only.

`paymentRedirectURL` - The url users are redirected t after the transaction has been authorized.

`authURL` - The url you need to redirect user to for the authorization flow to begin.

**Method**

1) `exchangeAuthToken(authToken)` - Returns a `GrowStocksUser`

Exhange the GrowStocks authorization code for a GrowStocksUser.

`authToken <string>` - Required - The code returned  to the redirectURL after the user authorized the organisation.

2) `getTransaction(transactionid)` - Returns a `Transaction`

Get details about a transaction by id.

`transactionid` - Required: - A valid growstocks transaction id.

3) `pay(userID, amount, note)` - Returns a `Transaction`

Pay a user a certain amount of wls.

`userID` - Required - The id o the user you want to send WLs to.

`amount` - Required - The amount of wls you want to send this user.

`note` - Optional - A 50 character or less note to add on the transaction.

4) `getBalance()` - Returns a `Number`

Returns the balance of the developer organisation.


**2) GrowStocksUser Class**

**Properties**

Properties: `id`, `name`, `growid`, `balance`, `scopes`, `token`, `client`

`id` - GrowStocks user id.

`name` - GrowStocks username.

`growid` - GrowStocks grow id.

`balance`- GrowStocks Pay user balance. (Must have balance scope enabled.)

`scopes` - Array of scopes which have been authorized.

`token` - The token used to update this user's data.

`client` - GrowStocks client instantiating this GrowStockUser.

**Method**

1) `bill(amount, note)` - Returns an object.

Create a transaction that takes from user's account to developer's account a specified number of world locks.

`amount` - The amount of world locks you want to take.

`note` - An optional note of maximum 50 characters to write on the transaction.

```js
// Result Example
{
  transaction: 'hszpJwPn8t',
  userRedirectURL: 'https://pay.growstocks.xyz/pay?client=583159871352836480&redirect_uri=http%3A%2F%2Flocalhost%3A3030%2Fpayments&transaction=hszpJwPn8t'
}
```

**2) `refreshUserData()`** - Returns `true`

Calling this method will update this class's values to the latest values provided by the API.
