"use strict";
import React, { Component, PropTypes } from "react";

export default class Alert extends Component {
	render() {
		const loadStatus = this.props.isLoading ? "loading" : "";
		const className = `alert-box ${this.props.alert.type || ""} ${loadStatus}`;

		return (
			<div className={className}>
				{ this.props.isLoading ?
					<div className="spinner">
						<div className="cube1"></div>
						<div className="cube2"></div>
					</div> :
					`${this.props.alert.type} ${ this.props.alert.message || "" }`
				}
			</div>
		);
	}
}

Alert.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	alert: PropTypes.shape({
		type: PropTypes.oneOf(["error", "success"]).isRequired,
		message: PropTypes.string
	})
};
