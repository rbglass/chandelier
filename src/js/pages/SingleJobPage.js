"use strict";
import React, { Component, PropTypes } from "react";
import SingleJobDetails from "../components/SingleJob/SingleJobDetails";
import SingleJobTable from "../components/SingleJob/SingleJobTable";
import SingleJobStore from "../stores/SingleJobStore";
import connectToStores from "../utils/connectToStores";



class SingleJobPage extends Component {

	render() {
		return (
			<div>
				<h1 className="page-header">Single Job</h1>
				<SingleJobDetails details={this.props.details} />
				<SingleJobTable items={this.props.items} />
			</div>
		);
	}
}

SingleJobPage.propTypes = {

};

function getState() {
	const details = SingleJobStore.getJobDetails();
	const items = SingleJobStore.getSortedItems();

	return {
		details,
		items
	};
}

export default connectToStores([SingleJobStore], getState)(SingleJobPage);
