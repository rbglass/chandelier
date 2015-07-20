"use strict";
import React, { Component, PropTypes } from "react";
import Table from "../components/table/Table";
import Filter from "../components/filter/Filter";
import NavBar from "../components/common/NavBar";
import Alert from "../components/common/Alert";
import connectToStores from "../utils/connectToStores";
import JobsStore from "../stores/JobsStore";
import SelectionStore from "../stores/SelectionStore";
import AlertStore from "../stores/AlertStore";
import PaginationStore from "../stores/PaginationStore";
import * as JobsActionCreators from "../actions/JobsActionCreators";
import * as SharedActionCreators from "../actions/SharedActionCreators";
import rbPrefixer from "../utils/rbPrefixer";

function requestDataFromServer() {
	SharedActionCreators.getSelections();
	JobsActionCreators.getAllJobs();
}

class JobsPage extends Component {

	componentWillMount() {
		requestDataFromServer();
	}

	componentWillUnmount() {
		SharedActionCreators.changePageNumber(0);
		SharedActionCreators.setRowsPerPage(50);
	}

	render() {
		let items = this.props.jobs.map(item => item.get("details"));

		return (
			<div>
				<NavBar title={"All Jobs"} >
					{(this.props.isLoading || this.props.alert) ?
						<Alert isLoading={this.props.isLoading} isUnsaved={this.props.isUnsaved}
							alert={this.props.alert} /> :
						<span />
					}
					<img src="/img/transparent.gif" className="logo" />
				</NavBar>
				<NavBar routeConfig={this.props.routeScheme}>
					<div className="nav nav-item logout">
						<a href="/logout">Logout</a>
					</div>
				</NavBar>
				<div className="container">
					<Filter filters={this.props.filters} selections={this.props.selections}
						setFilter={JobsActionCreators.setFilter}
						setStartDate={JobsActionCreators.setStartDate}
						setEndDate={JobsActionCreators.setEndDate}
						restrictTo={JobsActionCreators.restrictTo}
						presetConfig={this.props.presetScheme}
						currentPage={this.props.currentPage}
						rowsPerPage={this.props.rowsPerPage}
						numberOfRows={this.props.numberOfJobs}
						changePage={SharedActionCreators.changePageNumber} >
						<button className="add-button rounded" onClick={JobsActionCreators.createSingleJob}>
							New Job
						</button>
					</Filter>
					<div className="table-container">
						<Table selections={this.props.selections}
								filters={this.props.filters}
								items={items} primaryKey={"job_id"}
								tableScheme={this.props.tableScheme}
								onBlur={SharedActionCreators.saveDetails}
								sortFunc={SharedActionCreators.externalSortBy.bind(null, "jobs")}
						/>
					</div>
				</div>
			</div>
		);
	}
}

function getState() {
	const start = PaginationStore.getOffset();
	const end = start + PaginationStore.getRowsPerPage();

	const jobs = JobsStore.getFilteredJobs(start, end);
	const filters = JobsStore.getFilters();
	const currentPage = PaginationStore.getCurrentPage();
	const numberOfJobs = JobsStore.getNumberOfJobs();
	const rowsPerPage = PaginationStore.getRowsPerPage();
	const selections = SelectionStore.getSelections();
	const isLoading = AlertStore.getLoadStatus();
	const isUnsaved = AlertStore.getUnsavedStatus();
	const alert = AlertStore.getAlert();

	return {
		selections,
		jobs,
		filters,
		currentPage,
		numberOfJobs,
		rowsPerPage,
		isLoading,
		isUnsaved,
		alert
	};
}

export default connectToStores([
	JobsStore, SelectionStore,
	AlertStore, PaginationStore
], getState)(JobsPage);

JobsPage.defaultProps = {
	tableScheme: [
		{ key: "job_id",        display: "Job #",               "className": "qty-sm link",              type: "link", to: "singlejob", formattingFunc: rbPrefixer },
		{ key: "client",        display: "Client",              "className": "u-flex-grow1 lg-font",     type: "text",     onChange: SharedActionCreators.changeDetails },
		{ key: "project",       display: "Project",             "className": "lg-font",                  type: "text",     onChange: SharedActionCreators.changeDetails },
		{ key: "job_status",    display: "Job Status",          "className": "",                         type: "select",   onChange: SharedActionCreators.changeDetails },
		{ key: "order_type",    display: "Order Type",          "className": "",                         type: "select",   onChange: SharedActionCreators.changeDetails },
		{ key: "shipping_date", display: "Shipping Date",       "className": "u-flex-grow",              type: "date",     onChange: SharedActionCreators.changeDetails },
		{ key: "payment",       display: "Payment", 			      "className": "u-flex-grow",              type: "select",   onChange: SharedActionCreators.changeDetails },
		{ key: "parts_status",  display: "Parts Status",        "className": "",                         type: "select",   onChange: SharedActionCreators.changeDetails },
		{ key: "qty_items",     display: "Qty", line2: "Items", "className": "qty-xs link centered",     type: "link", to: "singlejob" },
		{ key: "notes",         display: "Notes",               "className": "u-flex-grow3", maxRows: 3, type: "textarea", onChange: SharedActionCreators.changeDetails }
	],
	presetScheme: [
		{
			description: "Clear All Filters",
			onSelect: [
				JobsActionCreators.clearJobsFilters
			]
		},
		{
			description: "Within 3 weeks & confirmed",
			onSelect: [
				JobsActionCreators.clearJobsFilters,
				JobsActionCreators.restrictTo.bind(null, "job_status", ["Confirmed"]),
				JobsActionCreators.setStartDate.bind(null, new Date()),
				JobsActionCreators.setEndDate.bind(null, new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 3))
			]
		},
		{
			description: "Packaged",
			onSelect: [
				JobsActionCreators.clearJobsFilters,
				JobsActionCreators.restrictTo.bind(null, "job_status", ["Packaged"])
			]
		},
		{
			description: "Shipping today",
			onSelect: [
				JobsActionCreators.clearJobsFilters,
				JobsActionCreators.restrictTo.bind(null, "job_status", ["Packaged"]),
				JobsActionCreators.setStartDate.bind(null, new Date()),
				JobsActionCreators.setEndDate.bind(null, new Date(Date.now() + 1000 * 60 * 60 * 24))
			]
		},
		{
			description: "Confirmed/Not paid",
			onSelect: [
				JobsActionCreators.clearJobsFilters,
				JobsActionCreators.restrictTo.bind(null, "job_status", ["Confirmed"]),
				JobsActionCreators.restrictTo.bind(null, "payment", ["Awaiting Payment", "Deposit"])
			]
		},
		{
			description: "Parts started",
			onSelect: [
				JobsActionCreators.clearJobsFilters,
				JobsActionCreators.restrictTo.bind(null, "parts_status", ["Started"])
			]
		}
	],
	routeScheme: [
		{ display: "Jobs", to: "jobs" },
		{ display: "Items", to: "items" },
		{ display: "Products", to: "products"}
	]
};
