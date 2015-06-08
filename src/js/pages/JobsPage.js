"use strict";
import React, { Component, PropTypes } from "react";
import Table from "../components/common/Table";
import NavBar from "../components/common/NavBar";
import JobsFilter from "../components/Jobs/JobsFilter";
import JobsStore from "../stores/JobsStore";
import SelectionStore from "../stores/SelectionStore";
import connectToStores from "../utils/connectToStores";
import * as JobsActionCreators from "../actions/JobsActionCreators";
import * as SharedActionCreators from "../actions/SharedActionCreators";

function requestDataFromServer() {
	SharedActionCreators.getSelections();
	JobsActionCreators.getAllJobs();
}

class JobsPage extends Component {

	componentWillMount() {
		requestDataFromServer();
	}

	render() {
		let items = this.props.items.map(item => item.details);

		return (
			<div>
				<NavBar title={"All Jobs"}/>
				<div className="container">
					<JobsFilter filters={this.props.filters} selections={this.props.selections}
						setFilter={JobsActionCreators.setFilter} setStartDate={JobsActionCreators.setStartDate}
						setEndDate={JobsActionCreators.setEndDate}
						restrictTo={JobsActionCreators.restrictTo}
					/>
					<Table {...this.props} items={items} primaryKey={"job_id"} onBlur={SharedActionCreators.saveDetails}/>
					<button className="add-button" onClick={JobsActionCreators.createSingleJob}>+</button>
				</div>
			</div>
		);
	}
}

JobsPage.defaultProps = {
	headers: [
		{ key: "job_id",        display: "Job #",         "className": "qty-sm",
				type: "link", to: "singlejob" },
		{ key: "client",        display: "Client",        "className": "u-flex-grow2",
				type: "text", onChange: SharedActionCreators.changeDetails },
		{ key: "project",       display: "Project",       "className": "",
				type: "text", onChange: SharedActionCreators.changeDetails },
		{ key: "job_status",    display: "Job Status",    "className": "",
				type: "select", onChange: SharedActionCreators.changeDetails },
		{ key: "order_type",    display: "Order Type",    "className": "",
				type: "select", onChange: SharedActionCreators.changeDetails },
		{ key: "shipping_date", display: "Shipping Date", "className": "u-flex-grow2",
				type: "date", onChange: SharedActionCreators.changeDetails },
		{ key: "job_items",     display: "# Job Items",   "className": "",
				type: "text" },
		{ key: "parts_status",  display: "Parts Status",  "className": "",
				type: "select", onChange: SharedActionCreators.changeDetails }
	]
};

function getState() {
	const filters = JobsStore.getFilters();
	const items = JobsStore.getFilteredAndSortedJobs();
	const selections = SelectionStore.getSelections();

	return {
		selections,
		filters,
		items
	};
}

export default connectToStores([JobsStore, SelectionStore], getState)(JobsPage);
