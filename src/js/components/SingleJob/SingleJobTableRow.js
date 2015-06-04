"use strict";
import React, { Component, PropTypes } from "react";
import request from "superagent";

export default class SingleJobTableRow extends Component {
	handleBlur(e) {
		console.log("blurred!", e.target.value);
	}
	newJobItemHandler(e) {
		request.get("/api/jobs")
					.end(function(err, response){
			if (err) {
				console.log(err);
			} else {
				console.log(response);
			}
		});
	}

	render() {
		let cells = this.props.cells;

		return (
			<div className="table-row" onBlur={this.handleBlur.bind(this)}>
				<div className="table-row-item fixed-col">
					<button className="btn btn-left">-</button>
				</div>
				<div className="table-row-item">{cells.item}</div>
				<div className="table-row-item">
					<input type="text" value={cells.product} />
				</div>
				<div className="table-row-item u-flex-grow3">
					<textarea value={cells.description}></textarea>
				</div>
				<div className="table-row-item">
					<select value={cells.glass}>
						<option>blue</option>
					</select>
				</div>
				<div className="table-row-item">
					<select value={cells.metal}>
						<option>heavy</option>
					</select>
				</div>
				<div className="table-row-item">
					<select value={cells.flex}>
						<option>flexbox</option>
					</select>
				</div>
				<div className="table-row-item">
					<select value={cells.bulb}>
						<option>light</option>
					</select>
				</div>
				<div className="table-row-item qty-sm">
					<input type="number" min={0} value={cells.qty_req} />
				</div>
				<div className="table-row-item qty-sm">
					<input type="number" min={0} value={cells.qty_hot} />
				</div>
				<div className="table-row-item qty-sm">
					<input type="number" min={0} value={cells.qty_cold} />
				</div>
				<div className="table-row-item qty-md">
					<input type="number" min={0} value={cells.qty_assem} />
				</div>
				<div className="table-row-item qty-md">
					<input type="number" min={0} value={cells.qty_packed} />
				</div>
				<div className="table-row-item u-flex-grow3">
					<textarea value={cells.notes}></textarea>
				</div>
				<div className="table-row-item fixed-col">
					<button onClick={this.newJobItemHandler.bind(this)} className="btn btn-right">+</button>
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
