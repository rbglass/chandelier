"use strict";
import I from "immutable";
import IPropTypes from "react-immutable-proptypes";
import React, { Component, PropTypes } from "react";
import tidy from "../../utils/tidy";

export default class MultiSelect extends Component {
	selectChange(e) {
		let currentlySelected = [].map.call(e.target.selectedOptions, element => {
			return element.value;
		});
		this.props.onSelect(this.props.selected.get("key"), currentlySelected);
	}

	checkboxChange(e) {
		const toSelectOrDeselect = e.target.checked ? this.props.selections : [];

		this.props.onSelect(this.props.selected.get("key"), toSelectOrDeselect);
	}

	render() {
		const isCheckboxChecked = this.props.selected.has("options") ?
			(this.props.selections && this.props.selected.get("options").size === this.props.selections.size
			) : true;
		const selected = this.props.selected;

		return (
			<div className="multiselect-holder">
				<label className="multiselect-title">{tidy(selected.get("key"))}</label>
				<label className="multiselect-label" htmlFor={selected.get("key")}>All:
					<input type="checkbox" className="multiselect-checkbox"
						checked={isCheckboxChecked} onChange={this.checkboxChange.bind(this)}
						id={selected.get("key")}/>
				</label>
				<select multiple={true}
					value={selected.toJS().options || this.props.selections.toJS()}
					onChange={this.selectChange.bind(this)} >
						{this.props.selections.map(opt => {
								return <option key={opt}>{opt.toString()}</option>;
						})}
				</select>
			</div>
		);
	}
}

MultiSelect.propTypes = {
	onSelect: PropTypes.func.isRequired,
	selections: IPropTypes.listOf(PropTypes.oneOfType([
			PropTypes.string, PropTypes.number, PropTypes.bool
		])),
	selected: IPropTypes.shape({
		key: PropTypes.string,
		options: IPropTypes.listOf(PropTypes.oneOfType([
			PropTypes.string, PropTypes.number, PropTypes.bool
		]))
	})
};
