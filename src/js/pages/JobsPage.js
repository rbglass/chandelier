"use strict";
import React, { Component, PropTypes } from "react";
import Table from "../components/common/Table";
import JobsFilter from "../components/Jobs/JobsFilter";
import JobsTableRow from "../components/Jobs/JobsTableRow";
import JobsStore from "../stores/JobsStore";
import connectToStores from "../utils/connectToStores";
import { createJob } from "../actions/JobsActionCreators";

class JobsPage extends Component {

	render() {
		return (
			<div>
				<h1 className="page-header">All Jobs</h1>
				<JobsFilter filters={this.props.filters} />
				<Table {...this.props} />
				<button className="add-button" onClick={createJob}>+</button>
			</div>
		);
	}
}

JobsPage.defaultProps = {
	headers: [
		{ key: "job_id",        display: "Job #",         "className": ""},
		{ key: "client",        display: "Client",        "className": ""},
		{ key: "project",       display: "Project",       "className": ""},
		{ key: "job_status",    display: "Job Status",    "className": ""},
		{ key: "order_type",    display: "Order Type",    "className": ""},
		{ key: "shipping_date", display: "Shipping Date", "className": "u-flex-grow2"},
		{ key: "job_items",     display: "# Job Items",   "className": ""},
		{ key: "parts_status",  display: "Parts Status",  "className": ""},
		{ key: "last_update",   display: "Last Update",   "className": "u-flex-grow2"}
	],
	RowComponent: JobsTableRow
};

function getState() {
	const filters = JobsStore.getFilters();
	const items = JobsStore.getFilteredAndSortedJobs();

	return {
		filters,
		items
	};
}

export default connectToStores([JobsStore], getState)(JobsPage);
