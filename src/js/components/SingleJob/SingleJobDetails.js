"use strict";
import React, { Component, PropTypes } from "react";
import { updateDetails } from "../../actions/JobsActionCreators";
import keySealer from "../../utils/keySealer";

export default class SingleJobDetails extends Component {

	render() {
		let details = this.props.details;

		return (
			<div className="job-details">
				<div className="job-details-column u-flex-grow3">
				<div className="job-details-field">
					<label htmlFor="job#">Job #:</label>
					<input type="text" value={details.job_id} className="job-text-input" id="job#"
							disabled />
				</div>
				<div className="job-details-field">
					<label htmlFor="client">Client:</label>
					<input type="text" value={details.client} className="job-text-input" id="client"
							onChange={keySealer(null, "client", updateDetails)} />
				</div>
				<div className="job-details-field">
					<label htmlFor="project">Project:</label>
					<input type="text" value={details.project} className="job-text-input" id="project"
							onChange={keySealer(null, "project", updateDetails)} />
				</div>
				<div className="job-details-field">
					<label htmlFor="clientref">Client Ref:</label>
					<input type="text" value={details.client_ref} className="job-text-input" id="clientref"
							onChange={keySealer(null, "client_ref", updateDetails)} />
				</div>
				<div className="job-details-field notes">
					<label htmlFor="notes">Notes:</label>
					<textarea type="text" className="job-text-area" id="notes" value={details.notes}
							onChange={keySealer(null, "notes", updateDetails)} />
				</div>
			</div>

			<div className="job-details-column u-flex-grow3">
				<div className="job-details-field">
					<label htmlFor="jobstatus">Job Status:</label>
					<input type="text" value={details.job_status} className="job-text-input" id="jobstatus"
							onChange={keySealer(null, "job_status", updateDetails)} />
				</div>
				<div className="job-details-field">
					<label htmlFor="ordertype">Order Type:</label>
					<select className="job-text-input" id="ordertype" value={details.order_type}
							onChange={keySealer(null, "order_type", updateDetails)} >
						<option>Standard</option>
					</select>
				</div>
				<div className="job-details-field">
					<label htmlFor="lastupdate">Last Update:</label>
					<input type="date" value={details.last_update} className="job-text-input" id="lastupdate"
							onChange={keySealer(null, "last_update", updateDetails)} />
				</div>
				<div className="job-details-field">
					<label htmlFor="partsstatus">Parts Status:</label>
					<select className="job-text-input" id="partsstatus" value={details.parts_status}
							onChange={keySealer(null, "parts_status", updateDetails)} >
						<option>Started</option>
					</select>
				</div>
				<div className="job-details-field notes">
					<label htmlFor="partsnotes">Parts Notes:</label>
					<textarea type="text" className="job-text-area" id="partsnotes" value={details.parts_notes}
							onChange={keySealer(null, "parts_notes", updateDetails)} />
				</div>
			</div>

			<div className="job-details-column u-flex-grow3">
				<div className="job-details-field">
					<label htmlFor="shippingdate">Shipping Date:</label>
					<input type="date" value={details.shipping_date} className="job-text-input" id="shippingdate" value="2015-07-01"
							onChange={keySealer(null, "shipping_date", updateDetails)} />
				</div>
				<div className="job-details-field notes u-flex-grow2">
					<label htmlFor="notes">Delivery Details:</label>
					<textarea type="text" className="job-text-area u-flex-grow2" id="notes" value={details.delivery_details}
							onChange={keySealer(null, "delivery_details", updateDetails)} />
				</div>
			</div>

			<div className="job-details-column">
				<div className="job-details-field">
					<input type="button" value="pdf" />
				</div>
			</div>
			</div>
		);
	}
}

SingleJobDetails.propTypes = {
	details: PropTypes.shape({
		jobid: PropTypes.string,
		client: PropTypes.string,
		project: PropTypes.string,
		client_ref: PropTypes.string,
		notes: PropTypes.string,
		job_status: PropTypes.string,
		order_type: PropTypes.string,
		last_update: PropTypes.string,
		parts_status: PropTypes.string,
		parts_notes: PropTypes.string,
		shipping_date: PropTypes.string,
		delivery_details: PropTypes.string
	})
};
