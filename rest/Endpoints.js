const auth = {
  base: "https://api.growstocks.xyz/v1/auth",
  user: `/user`
};

const pay = {};

const OAuth = {
  base: "https://auth.growstocks.xyz",
  authorize: (clientCode, scopes, redirectURL) => `/user/authorize?client=${encodeURIComponent(clientCode)}&scopes=${encodeURIComponent(scopes.join(","))}&redirect_uri=${encodeURIComponent(redirectURL)}`,
};

module.exports = {
  auth,
  pay,
  OAuth
}