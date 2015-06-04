"use strict";
import { Component, PropTypes } from "react";
import { getNode } from "../utils/TableUtils";

export default class TableCell extends Component {

	render() {
		let cellClass = `table-row-item ${this.props.column}`;

		return (
			<div className={cellClass} >
				{getNode(this.props.column, this.props.content)}
			</div>
		);
	}
}

TableCell.propTypes = {
	column: PropTypes.string.required,
	content: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.instanceOf(Date)
	])
};
