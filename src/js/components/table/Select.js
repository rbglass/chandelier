"use strict";
import IPropTypes from "react-immutable-proptypes";
import React, { Component, PropTypes } from "react";

export default class Select extends Component {
	shouldComponentUpdate(nextProps) {
		const shouldIt = nextProps.value !== this.props.value ||
											nextProps.selections !== this.props.selections;
		return shouldIt;
	}

	render() {
		return (
			<select value={this.props.value}>
				<option></option>
				{ this.props.selections ?
					this.props.selections.map((opt, n) => {
						let disabled = false;
						let val = opt;

						if (typeof opt !== "string") {
							disabled = !opt.get("active");
							val = opt.get("name");
						}

					return (
						<option key={n} disabled={disabled} >
							{val}
						</option>
					);
				}, this) : "No opts" }
			</select>
		);
	}
}

Select.propTypes = {
	value: PropTypes.string,
	selections: IPropTypes.listOf(
		PropTypes.oneOfType([
			PropTypes.string, IPropTypes.map
		])
	)
};

// Somewhat hacky solution (temp) to problem of 'inactive'
// but need-to-be-there options
