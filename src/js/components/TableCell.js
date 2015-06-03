"use strict";
var React = require("react");

var TableCell = React.createClass({

	render() {
		let cellClass = "table-row-item ";
		if(this.props.cellClass) cellClass += this.props.cellClass;

		return (
			<div className="table-row-item" >
				{this.props.children}
			</div>
		);
	}
});

module.exports = TableCell;

