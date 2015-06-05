"use strict";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { updateSingleJobDetails } from "../../actions/SharedActionCreators";
import keySealer from "../../utils/keySealer";

export default class JobsTableRow extends Component {
	handleBlur(e) {
		const currentRowNode = React.findDOMNode(this.refs.row);
		const destinationNode = e.relatedTarget.parentElement.parentElement;
		if(currentRowNode !== destinationNode) {
			console.log("Row to be sent: ", this.props.cells);
		}
	}

	render() {
		let cells = this.props.cells.details;
		console.log(cells);
		return (
			<div ref="row" className="table-row" onBlur={this.handleBlur.bind(this)}>
				<div className="table-row-item" >
					<Link to="singlejob" params={{id: cells.job_id}}>{cells.job_id}</Link>
				</div>
				<div className="table-row-item" >
					<input type="text" value={cells.client}
							onChange={keySealer(cells.job_id, "client", updateSingleJobDetails)}/>
				</div>
				<div className="table-row-item" >
					<input type="text" value={cells.project}
							onChange={keySealer(cells.job_id, "project", updateSingleJobDetails)}/>
				</div>
				<div className="table-row-item" >
					<select type="text" value={cells.job_status}
							onChange={keySealer(cells.job_id, "job_status", updateSingleJobDetails)}>
						{this.props.selections.job_status.map(opt => {
							return <option>{opt}</option>;
						})}
					</select>
				</div>
				<div className="table-row-item" >
					<select value={cells.order_type}
							onChange={keySealer(cells.job_id, "order_type", updateSingleJobDetails)}>
						{this.props.selections.order_type.map(opt => {
							return <option>{opt}</option>;
						})}
					</select>
				</div>
				<div className="table-row-item u-flex-grow2" >
					<input type="date" value={cells.shipping_date}
							onChange={keySealer(cells.job_id, "shipping_date", updateSingleJobDetails)}/>
				</div>
				<div className="table-row-item" >
					<input type="text" value={cells.job_items} />
				</div>
				<div className="table-row-item" >
					<select value={cells.parts_status}
							onChange={keySealer(cells.job_id, "parts_status", updateSingleJobDetails)} >
						{this.props.selections.parts_status.map(opt => {
							return <option>{opt}</option>;
						})}
					</select>
				</div>
				<div className="table-row-item u-flex-grow2" >
					<input type="date" value={cells.last_update}
							onChange={keySealer(cells.job_id, "last_update", updateSingleJobDetails)} />
				</div>
			</div>
		);
	}
}
