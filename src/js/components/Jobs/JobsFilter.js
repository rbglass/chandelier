"use strict";
import React, { Component, PropTypes } from "react";

export default class JobsFilter extends Component {
	filterChange(e) {
		this.props.setFilter(e.target.value);
	}
	startDateChange(e) {
		this.props.setStartDate(e.target.value);
	}
	endDateChange(e) {
		this.props.setEndDate(e.target.value);
	}

	render() {

		return (
			<div className="table-manip">
				<input type="text" value={this.props.filterBy} onChange={this.filterChange.bind(this)} className="job-text-input filter" placeholder="Filter Term" />
				<input type="date" value={this.props.startDate} onChange={this.startDateChange.bind(this)} className="job-text-input date" placeholder="Start Date" />
				<input type="date" value={this.props.endDate} onChange={this.endDateChange.bind(this)} className="job-text-input date" placeholder="End Date" />
		</div>
		);
	}
}

JobsFilter.propTypes = {
	filterBy: PropTypes.string,
	startDate: PropTypes.string,
	endDate: PropTypes.string
};
