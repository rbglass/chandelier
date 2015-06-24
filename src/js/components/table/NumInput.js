"use strict";
import React, { Component, PropTypes } from "react";

export default class NumInput extends Component {
	shouldComponentUpdate(nextProps) {
		const shouldIt = (nextProps.value !== this.props.value);
		return shouldIt;
	}

	handleNumFocus(e) {
		e.target.select();
	}

	render() {
		return <input type="number" min={0} value={this.props.value}
							onClick={this.handleNumFocus.bind(this)}/>;
	}
}

NumInput.propTypes = {
	value: PropTypes.number
};
