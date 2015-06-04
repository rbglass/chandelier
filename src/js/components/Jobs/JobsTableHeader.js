"use strict";
import React, { Component, PropTypes } from "react";
import { sortBy } from "../../actions/JobsActionCreators";

const headers = [
	{ key: "job_id",        display: "Job #",         "className": ""},
	{ key: "client",        display: "Client",        "className": ""},
	{ key: "project",       display: "Project",       "className": ""},
	{ key: "job_status",    display: "Job Status",    "className": ""},
	{ key: "order_type",    display: "Order Type",    "className": ""},
	{ key: "shipping_date", display: "Shipping Date", "className": "u-flex-grow2"},
	{ key: "job_items",     display: "# Job Items",   "className": ""},
	{ key: "parts_status",  display: "Parts Status",  "className": ""},
	{ key: "last_update",   display: "Last Update",   "className": "u-flex-grow2"}
]

export default class JobsTableHeader extends Component {

	render() {
		const headerSet = headers.map(e => {
			var sortDirection = "";

			if(this.props.filters.sortTerm === e.key) {
				sortDirection += this.props.filters.isAsc ? "asc" : "desc";
			}

			var divClass = `table-row-item ${e.className} ${sortDirection}`;
			return (
				<div key={e.key} className={divClass} onClick={sortBy.bind(null, e.key)}>{e.display}</div>
			);
		})

		return (
			<div className="table-row table-header">
				{headerSet}
			</div>
		);
	}
}
