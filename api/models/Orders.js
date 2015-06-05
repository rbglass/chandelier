//"use strict";
//var seqlz = require("./database");
//var Sequelize = require("sequelize");
//var Jobs = require("./Jobs");
//var Job_items = require("./Job_items");
//
//var Orders;
//
//Orders = seqlz.define('orders', {
//	id: {
//      type: Sequelize.INTEGER,
//      primaryKey: true,
//      autoIncrement: true
//    },
//	job_id: Sequelize.STRING
//});
//Jobs.belongsTo(Orders, {
//	foreignKey: 'details',
//	scope: {
//		job_id: 'Jobs'
//	}
//});
//
//Job_items.belongsTo(Orders, {
//	foreignKey: 'items',
//	scope: {
//		job_id: 'Job_items'
//	}
//});
//
//
//module.exports = Orders;
//

