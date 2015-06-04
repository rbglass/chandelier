"use strict";
import React, { Component, PropTypes } from "react";
import { sortBy } from "../../actions/JobsActionCreators";

export default class JobsTableHeader extends Component {

	render() {

		return (
			<div className="table-row table-header">
				<div className="table-row-item" onClick={sortBy.bind(this, "job_id")}>Job #</div>
				<div className="table-row-item" onClick={sortBy.bind(this, "client")}>Client</div>
				<div className="table-row-item" onClick={sortBy.bind(this, "project")}>Project</div>
				<div className="table-row-item" onClick={sortBy.bind(this, "job_status")}>Job Status</div>
				<div className="table-row-item" onClick={sortBy.bind(this, "order_type")}>Order Type</div>
				<div className="table-row-item u-flex-grow2" onClick={sortBy.bind(this, "shipping_date")}>Shipping Date</div>
				<div className="table-row-item" onClick={sortBy.bind(this, "job_items")}>#Job Items</div>
				<div className="table-row-item" onClick={sortBy.bind(this, "parts_status")}>Parts Status</div>
				<div className="table-row-item u-flex-grow2" onClick={sortBy.bind(this, "last_update")}>Last Update</div>
			</div>
		);
	}
}

JobsTableHeader.propTypes = {

};
