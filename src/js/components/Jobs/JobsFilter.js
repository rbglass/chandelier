"use strict";
import React, { Component, PropTypes } from "react";

export default class JobsFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	};


	render() {

		return (
			<div className="table-manip">
				<input type="text" value={this.props.filterBy}className="job-text-input filter" placeholder="Filter Term" />
				<input type="date" value={this.props.startDate}className="job-text-input date" placeholder="Start Date" />
				<input type="date" value={this.props.endDate}className="job-text-input date" placeholder="End Date" />
		</div>
		);
	}
}

JobsFilter.propTypes = {
	filterBy: PropTypes.string,
	startDate: PropTypes.string,
	endDate: PropTypes.string
};
