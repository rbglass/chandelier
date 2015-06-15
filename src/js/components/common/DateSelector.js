"use strict";
import React, { Component, PropTypes } from "react";
import yyyyMMdd, { ddMMMyyyy } from "../../utils/yyyyMMdd";

export default class DateSelector extends Component {
	changeHandler(e) {
		e.stopPropagation();
		this.props.onChange(e.target.value);
	}

	render() {
		const styleHolder = {
			position: "relative"
		};
		const styleFront = {
			position: "absolute",
			left: "5px",
			top: "5px",
			fontSize: "0.9rem",
			cursor: "initial",
			zIndex: "-999999"
		};
		const styleBehind = {
			color: "transparent",
			backgroundColor: "transparent"
		};

		return (
			<div className="date-selector" style={styleHolder} >
				<span className="date-selector-display" style={styleFront}>{ddMMMyyyy(this.props.value)}</span>
				<input type="date" className="date-selector-input" style={styleBehind}
						value={yyyyMMdd(this.props.value)}
						onChange={this.changeHandler.bind(this)}/>
			</div>
		);
	}
}

DateSelector.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
};
