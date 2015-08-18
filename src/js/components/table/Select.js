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
		const currentValueIfExists = this.props.selections &&
			this.props.selections.find(opt => this.props.value === opt);

		return (
			<select value={this.props.value} style={this.props.style}>
				{ currentValueIfExists === undefined ?
						<option disabled={true}>{this.props.value}</option> :
						null
				}
				{ this.props.selections ?
					this.props.selections.map((opt, n) => {
					return (
						<option key={n} >
							{opt}
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
		PropTypes.string
	)
};
