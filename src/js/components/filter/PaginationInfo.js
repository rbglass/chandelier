"use strict";
import React, { Component, PropTypes } from "react";

export default class PaginationInfo extends Component {
	selectHandler(e) {
		const valAsNum = Number(e.target.value) || Infinity;
		this.props.setRowsPerPage(valAsNum);
	}

	render() {
		const select = (
			<select value={this.props.rowsPerPage} onChange={this.selectHandler.bind(this)}>
				<option value={50}>50</option>
				<option value={100}>100</option>
				<option value={250}>250</option>
				<option value={Infinity}>All</option>
			</select>
		);

		return (
			<div>
				Showing {select} records ({`${this.props.numberOfRows} total records`})
			</div>
		);
	}
}

PaginationInfo.propTypes = {
	numberOfRows: PropTypes.number,
	rowsPerPage: PropTypes.number,
	setRowsPerPage: PropTypes.func
};
