"use strict";
import IPropTypes from "react-immutable-proptypes";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import TextArea from "react-textarea-autosize";
import NumInput from "./NumInput";
import TextInput from "./TextInput";
import Select from "./Select";
import DateSelector from "../common/DateSelector";
import keySealer from "../../utils/keySealer";
import yyyyMMdd from "../../utils/yyyyMMdd";
import isUsefulTag from "../../utils/isUsefulTag";

export default class TableRow extends Component {

	shouldComponentUpdate(nextProps) {
		let shouldIt = nextProps.cells !== this.props.cells ||
										nextProps.selections !== this.props.selections;
		return shouldIt;
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
			const cellValue = this.props.cells.get(cell.key);
			const isDisabled = !cell.onChange;
			let input;
			let cellDisplay;

			switch (cell.type) {

				case "textarea":
						input = <TextArea value={cellValue} useCacheForDOMMeasurements={false}
											minRows={2} maxRows={cell.maxRows}/>;
						break;

				case "number":
						input = <NumInput value={cellValue} />;
						break;

				case "text":
						input = <TextInput disabled={isDisabled} value={cellValue} />;
						break;

				case "date":
						input = <DateSelector value={cellValue} disabled={isDisabled} />;
						break;

				case "select":
						input = <Select value={cellValue} disabled={isDisabled}
											selections={this.props.selections.get(cell.key)} colored={cell.colored}/>;
						break;

				case "checkbox":
						input = <input type="checkbox" checked={cellValue}
											value={cellValue}/>;
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
						cellDisplay = cell.formattingFunc ? cell.formattingFunc(cellValue) : cellValue;
						input = <Link to={cell.to} params={{id: this.props.cells.get("job_id")}}>
											{cellDisplay}
										</Link>;
						break;

				default:
						cellDisplay = cell.formattingFunc ? cell.formattingFunc(cellValue) : cellValue;
						input = <span>{cellDisplay}</span>;
						break;
			}

			return (
				<div className={`table-row-item ${cell.className || ""}`} key={i}
							onChange={cell.onChange ? ks(cell.key, cell.onChange, cell.isNum, cell.isBool) : null}>
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
