"use strict";
import IPropTypes from "react-immutable-proptypes";
import React, { Component, PropTypes } from "react";

export default class TableHeader extends Component {
	shouldComponentUpdate(nextProps) {
		return nextProps.filters !== this.props.filters;
	}

	render() {
		const headerSet = this.props.headers.map((e, i) => {
			let directionClass = "";
			let currentlySortedAsc;
			let otherLines = e.line2 || "";
			let otherContent = e.otherContent || "";

			if (this.props.filters.get("sortTerm") === e.key) {
				currentlySortedAsc = this.props.filters.get("isAsc");
				directionClass +=  currentlySortedAsc ? "asc" : "desc";
			}


			var divClass = `table-row-item ${e.className} ${directionClass}`;
			return (
				<div key={i} className={divClass}
					onClick={this.props.sortFunc ? this.props.sortFunc.bind(null, e.key, currentlySortedAsc) : null}>
					<span className="display"> {e.display} <br/>{otherLines}</span>
					{ otherContent ? <span className="other-content">{otherContent}</span> : <span /> }
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
	filters: IPropTypes.shape({
		sortTerm: PropTypes.string,
		isAsc: PropTypes.bool
	}),
	sortFunc: PropTypes.func
};
