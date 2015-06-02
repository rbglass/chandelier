"use strict";
var config = require("../models/config.js");
var sequalize = new Sequalize(config.database.dburl);

var Users = sequalize.define('users', {});
var Jobs = sequalize.define('jobs', {});
var Job_items = sequalize.define('job_items', {});


modules.exports = {
	Users: Users,
	Jobs: Jobs,
	Job_items: Job_items
};
