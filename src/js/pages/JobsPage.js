"use strict";
import React, { Component, PropTypes } from "react";
import JobsFilter from "../components/Jobs/JobsFilter";
import JobsTable from "../components/Jobs/JobsTable";
import JobsStore from "../stores/JobsStore";
import connectToStores from "../utils/connectToStores";



class JobsPage extends Component {

	render() {
		return (
			<div>
				<h1 className="page-header">All Jobs</h1>
				<JobsFilter filters={this.props.filters} />
				<JobsTable {...this.props} />
			</div>
		);
	}
}

JobsPage.propTypes = {

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
