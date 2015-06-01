var server = require("./api/server.js");

server.start(
  console.log("Serving running at port: ", server.info.port);
  );
