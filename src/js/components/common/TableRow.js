"use strict";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import keySealer from "../../utils/keySealer";

export default class TableRow extends Component {
	handleBlur(e) {
		const currentRowNode = React.findDOMNode(this.refs.row);
		const destinationNode = e.relatedTarget && e.relatedTarget.parentElement.parentElement;
		if(currentRowNode !== destinationNode) {
			this.props.onBlur(this.props.cells[this.props.primaryKey], this.props.cells);
		}
	}

	// Break this into components
	render() {
		const ks = keySealer.bind(this, this.props.cells[this.props.primaryKey]);

		const cells = this.props.cellConfig.map((cell, i) => {
			let cellValue = this.props.cells[cell.key];
			let input;

			switch (cell.type) {

				case "textarea":
						input = <textarea value={cellValue} />;
						break;

				case "number":
						input = <input type="number" min={0} value={cellValue} />;
						break;

				case "text":
						let isDisabled = !cell.onChange;
						input = <input type="text" readOnly={isDisabled} disabled={isDisabled} value={cellValue} />;
						break;

				case "date":
						input = <input type="date" value={cellValue} />;
						break;

				case "select":
						input = (
							<select value={cellValue}>
								{ this.props.selections[cell.key].map(opt => {
									return <option key={opt}>{opt}</option>;
								}, this) }
							</select>
						);
						break;

				case "button":
						input = (
							<button className={`btn ${cell.inputClassName}`}
								onClick={cell.onClick.bind(this, this.props.cells.job_id, this.props.cells)}>
								{cell.key}
							</button>
						);
						break;

				case "link":
						input = <Link to={cell.to} params={{id: cellValue}}>{cellValue}</Link>;
						break;

				default:
						input = cellValue;
						break;
			}

			return (
				<div className={`table-row-item ${cell.className}`} key={i}
							onChange={cell.onChange ? ks(cell.key, cell.onChange) : null}>
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
	cells: PropTypes.object,
	selections: PropTypes.objectOf(PropTypes.array),
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