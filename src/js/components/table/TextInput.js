"use strict";
import React, { Component, PropTypes } from "react";

export default class TextInput extends Component {
	shouldComponentUpdate(nextProps) {
		const shouldIt = (nextProps.value !== this.props.value);
		return shouldIt;
	}

	render() {
		return <input type="text" readOnly={this.props.isDisabled}
							disabled={this.props.disabled} value={this.props.value} />;
	}
}

TextInput.propTypes = {
	value: PropTypes.string,
	disabled: PropTypes.bool
};
