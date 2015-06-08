"use strict";
import React, { Component, PropTypes } from "react";
import { changeItem, saveItem, createItem, deleteItem } from "../../actions/SingleJobActionCreators";
import keySealer from "../../utils/keySealer";

export default class SingleJobTableRow extends Component {
	handleBlur(e) {
		const currentRowNode = React.findDOMNode(this.refs.row);
		const destinationNode = e.relatedTarget && e.relatedTarget.parentElement.parentElement;
		if(currentRowNode !== destinationNode) {
			saveItem(this.props.cells.item_id, this.props.cells);
		}
	}

	// Break this into components
	render() {
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
						input = <input type="text" value={cellValue} />;
						break;

				case "select":
						input = (
							<select value={cellValue}>
								{ this.props.selections[cell.key].map(e => { return <option>{e}</option>; }, this) }
							</select>
						);
						break;

				default:
						input = cellValue;
						break;
			}

			return (
				<div className={`table-row-item ${cell.className}`} key={i}
							onChange={cell.key ? keySealer(this.props.cells.item_id, cell.key, changeItem) : null}>
					{input}
				</div>
			);
		}, this);

		return (
			<div ref="row" className="table-row" onBlur={this.handleBlur.bind(this)}>
				<div className="table-row-item fixed-col">
					<button className="btn btn-left" onClick={deleteItem.bind(this, this.props.cells.item_id)}>-</button>
				</div>
				{cells}
				<div className="table-row-item fixed-col" onClick={createItem.bind(this, this.props.cells)}>
					<button className="btn btn-right">+</button>
				</div>
			</div>
		);
	}
}

SingleJobTableRow.propTypes = {
	cells: PropTypes.shape({
		item: PropTypes.string,
		product: PropTypes.string,
		description: PropTypes.string,
		glass: PropTypes.string,
		metal: PropTypes.string,
		flex: PropTypes.string,
		bulb: PropTypes.string,
		qty_req: PropTypes.number,
		qty_hot: PropTypes.number,
		qty_cold: PropTypes.number,
		qty_assem: PropTypes.number,
		qty_packed: PropTypes.number,
		notes: PropTypes.string
	})
};
