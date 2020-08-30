const auth = {
  base: "https://api.growstocks.xyz/v1/auth",
  user: `/user`
};

const pay = {
  base: "https://api.growstocks.xyz/v1/pay",
  createTransaction: "/transaction/create",
  authorize: (clientCode, payRedirectURL, transactionID) => `https://pay.growstocks.xyz/pay?client=${encodeURIComponent(clientCode)}&redirect_uri=${encodeURIComponent(payRedirectURL)}&transaction=${encodeURIComponent(transactionID)}`,
  getTransaction: "/transaction/get"
};

const OAuth = {
  base: "https://auth.growstocks.xyz",
  authorize: (clientCode, scopes, redirectURL) => `/user/authorize?client=${encodeURIComponent(clientCode)}&scopes=${encodeURIComponent(scopes.join(","))}&redirect_uri=${encodeURIComponent(redirectURL)}`,
};

module.exports = {
  auth,
  pay,
  OAuth
}