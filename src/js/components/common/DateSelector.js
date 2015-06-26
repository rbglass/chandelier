"use strict";
import React, { Component, PropTypes } from "react";
import yyyyMMdd, { ddMMMyyyy } from "../../utils/yyyyMMdd";

export default class DateSelector extends Component {
	shouldComponentUpdate(nextProps) {
		const shouldIt = (nextProps.value !== this.props.value);
		return shouldIt;
	}

	changeHandler(e) {
		this.props.onChange(e.target.value);
	}

	render() {
		const styleHolder = {
			position: "relative"
		};
		const styleFront = {
			position: "absolute",
			left: "6px",
			bottom: "2px",
			fontSize: "0.9rem",
			lineHeight: "24px",
			maxHeight: "34px",
			cursor: "initial",
			pointerEvents: "none",
			width: "100%"
		};
		const styleBehind = {
			lineHeight: "24px",
			color: "transparent",
			backgroundColor: "transparent",
			width: "100%"
		};

		return (
			<div className={`date-selector ${this.props.className || ""}`} style={styleHolder} id={this.props.id}>
				{
					this.props.label ? <label className="date-selector-label">
						{this.props.label}
					</label> : null
				}
				<span className="date-selector-display" style={styleFront}>{ddMMMyyyy(this.props.value)}</span>
				<input type="date" className={`date-selector-input ${this.props.inputClass || ""}`} style={styleBehind}
						value={yyyyMMdd(this.props.value)} disabled={this.props.disabled}
						readOnly={this.props.disabled}
						onChange={this.props.onChange ? this.changeHandler.bind(this) : null}/>
			</div>
		);
	}
}

DateSelector.propTypes = {
	value: PropTypes.string,
	id: PropTypes.string,
	inputClass: PropTypes.string,
	label: PropTypes.string,
	disabled: PropTypes.bool,
	onChange: PropTypes.func
};
