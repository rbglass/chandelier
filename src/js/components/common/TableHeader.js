"use strict";
import React, { Component, PropTypes } from "react";

export default class TableHeader extends Component {

	render() {
		const headerSet = this.props.headers.map((e, i) => {
			var sortDirection = "";

			if(this.props.filters.sortTerm === e.key) {
				sortDirection += this.props.filters.isAsc ? "asc" : "desc";
			}

			var divClass = `table-row-item ${e.className} ${sortDirection}`;
			return (
				<div key={i} className={divClass}
					onClick={this.props.sortFunc ? this.props.sortFunc.bind(null, e.key) : null}>
				{e.display}
				</div>
			);
		});

		return (
			<div className="table-row table-header">
				{headerSet}
			</div>
		);
	}
}

TableHeader.PropTypes = {
	headers: PropTypes.arrayOf(PropTypes.shape({
		key: PropTypes.string,
		display: PropTypes.string,
		className: PropTypes.string
	})).isRequired,
	filters: PropTypes.shape({
		sortTerm: PropTypes.string,
		isAsc: PropTypes.bool
	}),
	sortFunc: PropTypes.func
};
