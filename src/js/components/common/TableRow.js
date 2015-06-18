"use strict";
import IPropTypes from "react-immutable-proptypes";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import TextArea from "react-textarea-autosize";
import DateSelector from "./DateSelector";
import keySealer from "../../utils/keySealer";
import yyyyMMdd from "../../utils/yyyyMMdd";
import isUsefulTag from "../../utils/isUsefulTag";

export default class TableRow extends Component {

	shouldComponentUpdate(nextProps) {
		return nextProps.cells !== this.props.cells;
	}

	handleBlur(e) {
		const currentRowNode = React.findDOMNode(this.refs.row);
		const destinationNode = e.relatedTarget && e.relatedTarget.parentElement.parentElement;
		if(isUsefulTag(e.target.tagName)) {
			if(currentRowNode !== destinationNode) {
				this.props.onBlur(this.props.cells.get(this.props.primaryKey), this.props.cells);
			}
		}
	}

	// Break this into components
	render() {
		const ks = keySealer.bind(this, this.props.cells.get(this.props.primaryKey));

		const cells = this.props.cellConfig.map((cell, i) => {
			let cellValue = this.props.cells.get(cell.key);
			let input;
			let isDisabled;

			switch (cell.type) {

				case "textarea":
						input = <TextArea value={cellValue} useCacheForDOMMeasurements={true} minRows={2}/>;
						break;

				case "number":
						input = <input type="number" min={0} value={cellValue} />;
						break;

				case "text":
						isDisabled = !cell.onChange;
						input = <input type="text" readOnly={isDisabled} disabled={isDisabled} value={cellValue} />;
						break;

				case "date":
						isDisabled = !cell.onChange;
						input = <DateSelector value={cellValue} readOnly={isDisabled} disabled={isDisabled} />;
						break;

				case "select":
						input = (
							<select value={cellValue}>
								<option></option>
								{ this.props.selections.has(cell.key) ?
									this.props.selections.get(cell.key).map((opt, n) => {
									return <option key={opt + " " + n}>{opt}</option>;
								}, this) : "No opts" }
							</select>
						);
						break;

				case "button":
						input = (
							<button className={`btn ${cell.inputClassName}`}
								onClick={cell.onClick ?
									cell.onClick.bind(this, this.props.cells.get("job_id"), this.props.cells) :
									null}>
								{cell.key}
							</button>
						);
						break;

				case "link":
						let cellDisplay = cell.formattingFunc ? cell.formattingFunc(cellValue) : cellValue;
						input = <Link to={cell.to} params={{id: cellValue}}>{cellDisplay}</Link>;
						break;

				default:
						cellValue = cell.formattingFunc ? cell.formattingFunc(cellValue) : cellValue;
						input = cellValue;
						break;
			}

			return (
				<div className={`table-row-item ${cell.className || ""}`} key={i}
							onChange={cell.onChange ? ks(cell.key, cell.onChange, cell.isNum) : null}>
					{input}
				</div>
			);
		}, this);

		return (
			<div ref="row" className="table-row" onBlur={this.handleBlur.bind(this)}>
				{cells}
			</div>
		);
	}
}

TableRow.propTypes = {
	cells: IPropTypes.map,
	selections: IPropTypes.mapOf(IPropTypes.list),
	primaryKey: PropTypes.string,
	cellConfig: PropTypes.arrayOf(PropTypes.shape({
		key: PropTypes.string.isRequired,
		type: PropTypes.string,
		onChange: PropTypes.func,
		to: PropTypes.string,
		className: PropTypes.string,
		inputClassName: PropTypes.string
	})),
	onBlur: PropTypes.func
};
