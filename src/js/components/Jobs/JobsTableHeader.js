"use strict";
import React, { Component, PropTypes } from "react";

export default class JobsTableHeader extends Component {
	render() {

		return (
			<div className="table-row table-header">
				<div className="table-row-item">Job #</div>
				<div className="table-row-item">Client</div>
				<div className="table-row-item">Project</div>
				<div className="table-row-item">Job Status</div>
				<div className="table-row-item">Order Type</div>
				<div className="table-row-item u-flex-grow2">Shipping Date</div>
				<div className="table-row-item">#Job Items</div>
				<div className="table-row-item">Parts Status</div>
				<div className="table-row-item u-flex-grow2">Last Update</div>
			</div>
		);
	}
}

JobsTableHeader.propTypes = {

};
