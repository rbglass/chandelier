"use strict";
import React, { Component, PropTypes } from "react";
import tidy from "../../utils/tidy";

export default class MultiSelect extends Component {
	selectChange(e) {
		let currentlySelected = [].map.call(e.target.selectedOptions, element => {
			return element.value;
		});
		this.props.onSelect(this.props.selected.key, currentlySelected);
	}

	checkboxChange(e) {
		const toSelectOrDeselect = e.target.checked ? this.props.selections : [];

		this.props.onSelect(this.props.selected.key, toSelectOrDeselect);
	}

	render() {
		const isCheckboxChecked = ( this.props.selected.options && this.props.selections &&
			this.props.selected.options.length === this.props.selections.length
			);

		return (
			<div className="multiselect-holder">
				<label className="multiselect-title">{tidy(this.props.selected.key)}</label>
				<label className="multiselect-label" htmlFor={this.props.selected.key}>Select all:
					<input type="checkbox" className="multiselect-checkbox"
						checked={isCheckboxChecked} onChange={this.checkboxChange.bind(this)} id={this.props.selected.key}/>
				</label>
				<select multiple={true} value={this.props.selected.options}
					onChange={this.selectChange.bind(this)} >
						{this.props.selections.map(opt => {
								return <option key={opt}>{opt}</option>;
						})}
				</select>
			</div>
		);
	}
}

MultiSelect.propTypes = {
	onSelect: PropTypes.func.isRequired,
	selections: PropTypes.arrayOf(PropTypes.string),
	selected: PropTypes.shape({
		key: PropTypes.string,
		options: PropTypes.arrayOf(PropTypes.string)
	})
};
