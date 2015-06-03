module.exports = {

  cookie : {
    password : process.env.COOKIE_PASSWORD || require("./creds.json").cookie.password
  },
  bell : {
    password     : process.env.BELL_PASSWORD     || require("./creds.json").bell.password,
    clientID     : process.env.BELL_CLIENTID     || require("./creds.json").bell.clientID,
    clientSecret : process.env.BELL_CLIENTSECRET || require("./creds.json").bell.clientSecret
  },
	database: {
		dbname			: process.env.DB_NAME 		|| require("./creds.json").database.dbname,
		dburl				: process.env.DB_URL 			|| require("./creds.json").database.dburl,
		dbuser			: process.env.DB_USER 		|| require("./creds.json").database.dbuser,
		dbpassword	: process.env.DB_PASSWORD	|| require("./creds.json").database.dbpassword,
		sslmode			: process.env.SSLMODE 		|| require("./creds.json").database.sslmode
	},
	localdb: {
		localdburl: process.env.LOCAL_DB_URL || require("./creds.json").localdb.localdburl
	}
};
