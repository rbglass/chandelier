"use strict";
import React, { Component, PropTypes } from "react";

export default class FilterInput extends Component {
	filterChange(e) {
		this.props.setFilter(e.target.value);
	}
	render() {

		return (
			<input type={this.props.type}
					value={this.props.filterBy}
					onChange={this.filterChange.bind(this)}
					className={this.props.className}
					placeholder={this.props.placeholder} />
		);
	}
}

FilterInput.propTypes = {
	value: PropTypes.string,
	setFilter: PropTypes.func.isRequired,
	className: PropTypes.string,
	placeholder: PropTypes.string
};
