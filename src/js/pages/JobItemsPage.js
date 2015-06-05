"use strict";
import React, { Component, PropTypes } from "react";
import Table from "../components/common/Table";
import connectToStores from "../utils/connectToStores";
import JobItemsActionCreators from "../actions/JobItemsActionCreators";
import JobItemsStore from "../stores/JobItemsStore";

function requestDataFromServer() {
	JobItemsActionCreators.getAllJobItems();
}

class JobItemsPage extends Component {

	componentWillMount() {
		requestDataFromServer();
	}

	render() {
		return (
			<div>
				<h1 className="page-header">Single Job</h1>
				<Filter {...this.props} />
				<Table {...this.props} />
			</div>
		);
	}
}

function getState() {
	const items = JobItemsStore.getJobItems();

	return {
		items
	};
}

export default connectToStores([JobItemsStore], getState)(JobItemsPage);
