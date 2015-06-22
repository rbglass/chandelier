"use strict";
import React, { Component, PropTypes } from "react";

export default class Preset extends Component {
	clickHandler() {
		this.props.onSelect.forEach(fn => fn());
	}

	render() {
		const base = "preset";
		const labelClassName = `${base} ${base}-label`;
		const buttonClassName = `${base} ${base}-button`;
		const labelId = this.props.description.split("")[0];

		return (
			<div className={base} >
				<button className={buttonClassName} id={labelId}
					onClick={this.clickHandler.bind(this)}>
					{this.props.description}
				</button>
			</div>
		);
	}
}

Preset.propTypes = {
	description: PropTypes.string,
	onSelect: PropTypes.arrayOf(PropTypes.func)
};
