"use strict";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class JobsTableRow extends Component {
	handleBlur(e) {
		console.log("blurred!", e.target.value);
	}

	render() {
		let cells = this.props.cells;
		return (
			<div className="table-row" onBlur={this.handleBlur.bind(this)}>
				<div className="table-row-item" data-header="Header1">
					<Link to="singlejob" params={{id: cells.job_id}}>{cells.job_id}</Link>
				</div>
				<div className="table-row-item" data-header="Header2">
					<input type="text" value={cells.client} />
				</div>
				<div className="table-row-item" data-header="Header3">
					<input type="text" value={cells.project} />
				</div>
				<div className="table-row-item" data-header="Header4">
					<input type="text" value={cells.job_status} />
				</div>
				<div className="table-row-item" data-header="Header5">
					<input type="text" value={cells.order_type} />
				</div>
				<div className="table-row-item u-flex-grow2" data-header="Header6">
					<input type="date" value={cells.shipping_date} />
				</div>
				<div className="table-row-item" data-header="Header7">
					<input type="text" value={cells.job_items} />
				</div>
				<div className="table-row-item" data-header="Header8">
					<input type="text" value={cells.parts_status} />
				</div>
				<div className="table-row-item u-flex-grow2" data-header="Header9">
					<input type="date" value={cells.last_update} />
				</div>
			</div>
		);
	}
}

JobsTableRow.propTypes = {
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
