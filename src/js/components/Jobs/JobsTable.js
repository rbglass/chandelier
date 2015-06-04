"use strict";
import React, { Component, PropTypes } from "react";
import JobsTableHeader from "./JobsTableHeader";
import JobsTableRow from "./JobsTableRow";
import JobsFilter from "./JobsFilter";

export default class Table extends Component {
	render() {
		const rows = this.props.items.map((row, i) => {
			return <JobsTableRow key={i} cells={row} />;
		});
		return (
			<div className="table">
				<JobsTableHeader headers={this.props.headers} />
				{rows}
			</div>
		);
	}
}

Table.propTypes = {

};
