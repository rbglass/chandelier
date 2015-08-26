"use strict";
import React, { Component, PropTypes } from "react";

export default class NumInput extends Component {
	shouldComponentUpdate(nextProps) {
		const shouldIt = nextProps !== this.props;
		return shouldIt;
	}

	handleNumFocus(e) {
		e.target.select();
	}

	render() {
		const numStyle = {
			color: this.props.color
		};

		return <input type="number" min={0} value={this.props.value}
							onClick={this.handleNumFocus.bind(this)} style={numStyle}/>;
	}
}

NumInput.propTypes = {
	value: PropTypes.number,
	color: PropTypes.string
};
