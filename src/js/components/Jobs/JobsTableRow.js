"use strict";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { changeDetails, saveDetails } from "../../actions/SharedActionCreators";
import keySealer from "../../utils/keySealer";

export default class JobsTableRow extends Component {
	handleBlur(e) {
		const currentRowNode = React.findDOMNode(this.refs.row);
		const destinationNode = e.relatedTarget && e.relatedTarget.parentElement.parentElement;

		if(currentRowNode !== destinationNode) {
			saveDetails(this.props.cells.job_id, this.props.cells);
		}
	}

	render() {
		let cells = this.props.cells.details;
		const ks = keySealer.bind(this, cells.job_id);

		return (
			<div ref="row" className="table-row" onBlur={this.handleBlur.bind(this)}>
				<div className="table-row-item qty-sm" >
					<Link to="singlejob" params={{id: cells.job_id}}>{cells.job_id}</Link>
				</div>
				<div className="table-row-item u-flex-grow2" >
					<input type="text" value={cells.client}
							onChange={ks("client", changeDetails)}/>
				</div>
				<div className="table-row-item" >
					<input type="text" value={cells.project}
							onChange={ks("project", changeDetails)}/>
				</div>
				<div className="table-row-item" >
					<select type="text" value={cells.job_status}
							onChange={ks("job_status", changeDetails)}>
						{this.props.selections.job_status.map(opt => {
							return <option key={opt}>{opt}</option>;
						})}
					</select>
				</div>
				<div className="table-row-item" >
					<select value={cells.order_type}
							onChange={ks("order_type", changeDetails)}>
						{this.props.selections.order_type.map(opt => {
							return <option key={opt}>{opt}</option>;
						})}
					</select>
				</div>
				<div className="table-row-item u-flex-grow2" >
					<input type="date" value={cells.shipping_date}
							onChange={ks("shipping_date", changeDetails)}/>
				</div>
				<div className="table-row-item" >
					<input type="text" readOnly disabled value={cells.job_items} />
				</div>
				<div className="table-row-item" >
					<select value={cells.parts_status}
							onChange={ks("parts_status", changeDetails)} >
						{this.props.selections.parts_status.map(opt => {
							return <option key={opt}>{opt}</option>;
						})}
					</select>
				</div>
			</div>
		);
	}
}
