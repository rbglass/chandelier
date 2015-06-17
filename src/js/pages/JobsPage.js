"use strict";
import React, { Component, PropTypes } from "react";
import Table from "../components/common/Table";
import NavBar from "../components/common/NavBar";
import Filter from "../components/common/Filter";
import Alert from "../components/common/Alert";
import JobsStore from "../stores/JobsStore";
import SelectionStore from "../stores/SelectionStore";
import AlertStore from "../stores/AlertStore";
import connectToStores from "../utils/connectToStores";
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

	render() {
		let items = this.props.items.map(item => item.details);

		return (
			<div>
				<NavBar title={"All Jobs"} routeConfig={this.props.routeScheme}/>
				{(this.props.isLoading || this.props.alert) ?
					<Alert isLoading={this.props.isLoading} alert={this.props.alert} /> :
					<span />
				}
				<div className="container">
					<Filter filters={this.props.filters} selections={this.props.selections}
						setFilter={SharedActionCreators.setFilter}
						setStartDate={SharedActionCreators.setStartDate}
						setEndDate={SharedActionCreators.setEndDate}
						restrictTo={SharedActionCreators.restrictTo}
						presetConfig={this.props.presetScheme} >
						<button className="add-button rounded" onClick={JobsActionCreators.createSingleJob}>+</button>
					</Filter>
					<div className="table-container">
						<Table {...this.props}
								items={items} primaryKey={"job_id"}
								onBlur={SharedActionCreators.saveDetails}
								sortFunc={SharedActionCreators.sortBy}
						/>
					</div>
					<button className="add-button" onClick={JobsActionCreators.createSingleJob}>+</button>
				</div>
			</div>
		);
	}
}

function getState() {
	const items = JobsStore.getFilteredAndSortedJobs();
	const filters = JobsStore.getFilters();
	const selections = SelectionStore.getSelections();
	const isLoading = AlertStore.getLoadStatus();
	const alert = AlertStore.getAlert();

	return {
		selections,
		items,
		filters,
		isLoading,
		alert
	};
}

export default connectToStores([JobsStore, SelectionStore, AlertStore], getState)(JobsPage);

JobsPage.defaultProps = {
	tableScheme: [
		{ key: "job_id",        display: "Job #",         "className": "qty-sm link",       type: "link", to: "singlejob", formattingFunc: rbPrefixer },
		{ key: "client",        display: "Client",        "className": "u-flex-grow1 semi", type: "text",   onChange: SharedActionCreators.changeDetails },
		{ key: "project",       display: "Project",       "className": "",                  type: "text",   onChange: SharedActionCreators.changeDetails },
		{ key: "job_status",    display: "Job Status",    "className": "",                  type: "select", onChange: SharedActionCreators.changeDetails },
		{ key: "order_type",    display: "Order Type",    "className": "",                  type: "select", onChange: SharedActionCreators.changeDetails },
		{ key: "shipping_date", display: "Shipping Date", "className": "u-flex-grow",       type: "date",   onChange: SharedActionCreators.changeDetails },
		{ key: "payment",       display: "Payment", 			"className": "u-flex-grow",       type: "select", onChange: SharedActionCreators.changeDetails },
		{ key: "parts_status",  display: "Parts Status",  "className": "",                  type: "select", onChange: SharedActionCreators.changeDetails }
	],
	presetScheme: [
		{
			description: "Within 2 weeks & job confirmed",
			onSelect: [
				SharedActionCreators.restrictTo.bind(null, "job_status", ["Confirmed", "Packaged"]),
				SharedActionCreators.setStartDate.bind(null, new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 * 2))
		]},
		{
			description: "Parts started",
			onSelect: [
				SharedActionCreators.restrictTo.bind(null, "parts_status", ["Started"])
		]}

	]
};
