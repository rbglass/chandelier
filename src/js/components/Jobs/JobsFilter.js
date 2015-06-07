"use strict";
import React, { Component, PropTypes } from "react";
import FilterInput from "../common/FilterInput";

export default class JobsFilter extends Component {

	render() {
		// use cx
		const baseClassName = "job-text-input ";
		const textFilterClassName = baseClassName + "filter";
		const dateFilterClassName = baseClassName + "date";

		return (
			<div className="table-manip">
				<FilterInput type="text" value={this.props.filterBy}
					setFilter={this.props.setFilter} className={textFilterClassName}
					placeholder="Filter by..."
				/>
				<FilterInput type="date" value={this.props.startDate}
					setFilter={this.props.setStartDate} className={dateFilterClassName}
					placeholder="Start Date"
				/>
				<FilterInput type="date" value={this.props.endDate}
					setFilter={this.props.setEndDate} className={dateFilterClassName}
					placeholder="End Date"
				/>
		</div>
		);
	}
}

JobsFilter.propTypes = {
	filterBy: PropTypes.string,
	startDate: PropTypes.string,
	endDate: PropTypes.string,
	setFilter: PropTypes.func,
	setStartDate: PropTypes.func,
	setEndDate: PropTypes.func
};
