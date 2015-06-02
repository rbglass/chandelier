module.exports = {

  cookie : {
    password : process.env.PASSWORD || require("./creds.json").cookie.password
  },
  bell : {
    password     : process.env.PASSWORD     || require("./creds.json").bell.password,
    clientID     : process.env.CLIENTID     || require("./creds.json").bell.clientID,
    clientSecret : process.env.CLIENTSECRET || require("./creds.json").bell.clientSecret
  }
};
