"use strict";
import React, { Component, PropTypes } from "react";
import { sortBy } from "../../actions/SharedActionCreators";

export default class JobsTableHeader extends Component {

	render() {
		const headerSet = this.props.headers.map((e, i) => {
			var sortDirection = "";

			if(this.props.filters.sortTerm === e.key) {
				sortDirection += this.props.filters.isAsc ? "asc" : "desc";
			}

			var divClass = `table-row-item ${e.className} ${sortDirection}`;
			return (
				<div key={i} className={divClass} onClick={sortBy.bind(null, e.key)}>{e.display}</div>
			);
		});

		return (
			<div className="table-row table-header">
				{headerSet}
			</div>
		);
	}
}
