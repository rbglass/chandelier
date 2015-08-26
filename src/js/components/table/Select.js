"use strict";
import IPropTypes from "react-immutable-proptypes";
import React, { Component, PropTypes } from "react";

// TODO: pass these down as props rather than hard
// defining them in this component.
// The coloring should perhaps be defined in a higher order component
const colors = ["black", "#E8890B", "black", "#D828AE", "#008000", "#FF0000", "#3879B9", "#3879B9"];

export default class Select extends Component {
	shouldComponentUpdate(nextProps) {
		const shouldIt = nextProps.value !== this.props.value ||
											nextProps.selections !== this.props.selections;
		return shouldIt;
	}

	render() {
		const currentValueIfExists = this.props.selections &&
			this.props.selections.find(opt => this.props.value === opt);

		const currentIndex = this.props.selections &&
			this.props.selections.indexOf(this.props.value);

		const { colored } = this.props;

		const selectColor = colored ? colors[currentIndex] : "black";

		return (
			<select value={this.props.value} className={this.props.className}
					style={{"color": selectColor}} disabled={this.props.disabled}>
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
				}) : "No opts" }
			</select>
		);
	}
}

Select.propTypes = {
	value: PropTypes.string,
	selections: IPropTypes.listOf(
		PropTypes.string
	),
	className: PropTypes.string
};
