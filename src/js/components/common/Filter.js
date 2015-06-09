"use strict";
import React, { Component, PropTypes } from "react";
import FilterInput from "../common/FilterInput";
import MultiSelect from "../common/MultiSelect";

export default class Filter extends Component {

	render() {
		// use cx
		const baseClassName = "job-text-input ";
		const textFilterClassName = baseClassName + "filter";
		const dateFilterClassName = baseClassName + "date";

		const selects = Object.keys(this.props.filters.restrictions).map(restr => {
			return (
				<MultiSelect key={restr}
					selected={this.props.filters.restrictions[restr]}
					selections={this.props.selections[restr]}
					onSelect={this.props.restrictTo}
				/>
			);
		});

		return (
			<div className="table-manip">
				<div className="table-manip-col" >
					<FilterInput type="text" value={this.props.filterBy}
						setFilter={this.props.setFilter} className={textFilterClassName}
						placeholder="Filter all by..."
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
				<div className="table-manip-col">
					{selects}
				</div>
		</div>
		);
	}
}

Filter.propTypes = {
	filterBy    : PropTypes.string,
	startDate   : PropTypes.string,
	endDate     : PropTypes.string,

	selections  : PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
	restrictions: PropTypes.objectOf(PropTypes.shape({
			key    : PropTypes.string,
			options: PropTypes.arrayOf(PropTypes.string)
		})
	),

	setFilter   : PropTypes.func,
	setStartDate: PropTypes.func,
	setEndDate  : PropTypes.func,
	onSelect    : PropTypes.func
};
