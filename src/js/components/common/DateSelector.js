"use strict";
import React, { Component, PropTypes } from "react";
import yyyyMMdd, { ddMMMyyyy } from "../../utils/yyyyMMdd";

export default class DateSelector extends Component {

	render() {
		const styleHolder = {
			position: "relative"
		};
		const styleFront = {
			position: "absolute",
			left: "2px",
			top: "1px",
			fontSize: "0.9rem",
			cursor: "initial",
			pointerEvents: "none"
		};
		const styleBehind = {
			color: "transparent",
			backgroundColor: "transparent"
		};

		return (
			<div className="date-selector" style={styleHolder} >
				<span className="date-selector-display" style={styleFront}>{ddMMMyyyy(this.props.value)}</span>
				<input type="date" className="date-selector-input" style={styleBehind}
						value={yyyyMMdd(this.props.value)} />
			</div>
		);
	}
}

DateSelector.propTypes = {
	value: PropTypes.string.isRequired
};
