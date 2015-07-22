"use strict";
import React, { Component, PropTypes } from "react";

export default class PaginationInfo extends Component {
	render() {
		return (
			<div>
				{`${this.props.numberOfRows} total records`}
			</div>
		);
	}
}

PaginationInfo.propTypes = {
	numberOfRows: PropTypes.number
};
