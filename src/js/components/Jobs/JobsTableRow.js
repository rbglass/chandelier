"use strict";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { updateJob } from "../../actions/JobsActionCreators";
import keySealer from "../../utils/keySealer";

export default class JobsTableRow extends Component {
	handleBlur(e) {
		console.log("blurred!", e.target.value);
	}

	render() {
		let cells = this.props.cells;
		return (
			<div className="table-row" onBlur={this.handleBlur.bind(this)}>
				<div className="table-row-item" >
					<Link to="singlejob" params={{id: cells.job_id}}>{cells.job_id}</Link>
				</div>
				<div className="table-row-item" >
					<input type="text" value={cells.client}
							onChange={keySealer(cells.job_id, "client", updateJob)}/>
				</div>
				<div className="table-row-item" >
					<input type="text" value={cells.project}
							onChange={keySealer(cells.job_id, "project", updateJob)}/>
				</div>
				<div className="table-row-item" >
					<input type="text" value={cells.job_status}
							onChange={keySealer(cells.job_id, "job_status", updateJob)}/>
				</div>
				<div className="table-row-item" >
					<input type="text" value={cells.order_type}
							onChange={keySealer(cells.job_id, "order_type", updateJob)}/>
				</div>
				<div className="table-row-item u-flex-grow2" >
					<input type="date" value={cells.shipping_date}
							onChange={keySealer(cells.job_id, "shipping_date", updateJob)}/>
				</div>
				<div className="table-row-item" >
					<input type="text" value={cells.job_items} />
				</div>
				<div className="table-row-item" >
					<input type="text" value={cells.parts_status}
							onChange={keySealer(cells.job_id, "parts_status", updateJob)}/>
				</div>
				<div className="table-row-item u-flex-grow2" >
					<input type="date" value={cells.last_update}
							onChange={keySealer(cells.job_id, "last_update", updateJob)}/>
				</div>
			</div>
		);
	}
}
