"use strict";
import React, { Component, PropTypes } from "react";

export default class Alert extends Component {
	render() {
		const loadStatus = this.props.isLoading ? "loading" : "";
		const className = `alert-box ${this.props.alert && this.props.alert.type || ""} ${loadStatus}`;
		var content;

		if (this.props.isLoading) {
			content = "Working...";
		} else if (this.props.isUnsaved) {
			content = "Not saved";
		} else if (this.props.alert) {
			content = `${ this.props.alert.message || "" }`;
		} else {
			content = <span />;
		}
		return (
			<div className={className}>
				{content}
			</div>
		);
	}
}

Alert.propTypes = {
	isLoading: PropTypes.bool,
	isUnsaved: PropTypes.bool,
	alert: PropTypes.shape({
		type: PropTypes.oneOf(["error", "success"]),
		message: PropTypes.string
	})
};
