"use strict";
import React, { Component, PropTypes } from "react";
import { changeDetails, saveDetails } from "../../actions/SharedActionCreators";
import { getPDF } from "../../actions/SingleJobActionCreators";
import keySealer from "../../utils/keySealer";

export default class SingleJobDetails extends Component {
	handleBlur(e) {
		saveDetails(this.props.details.job_id, this.props.details);
	}

	render() {
		let details = this.props.details;
		const ks = keySealer.bind(this, details.job_id);

		return (
			<div className="job-details" onBlur={this.handleBlur.bind(this)}>
				<div className="job-details-column u-flex-grow3">
				<div className="job-details-field">
					<label htmlFor="job#">Job #:</label>
					<input type="text" value={details.job_id} className="job-text-input" id="job#"
							disabled readOnly />
				</div>
				<div className="job-details-field">
					<label htmlFor="client">Client:</label>
					<input type="text" value={details.client} className="job-text-input" id="client"
							onChange={ks("client", changeDetails)} />
				</div>
				<div className="job-details-field">
					<label htmlFor="project">Project:</label>
					<input type="text" value={details.project} className="job-text-input" id="project"
							onChange={ks("project", changeDetails)} />
				</div>
				<div className="job-details-field">
					<label htmlFor="clientref">Client Ref:</label>
					<input type="text" value={details.client_ref} className="job-text-input" id="clientref"
							onChange={ks("client_ref", changeDetails)} />
				</div>
				<div className="job-details-field notes">
					<label htmlFor="notes">Notes:</label>
					<textarea type="text" className="job-text-area" id="notes" value={details.notes}
							onChange={ks("notes", changeDetails)} />
				</div>
			</div>

			<div className="job-details-column u-flex-grow3">
				<div className="job-details-field">
					<label htmlFor="jobstatus">Job Status:</label>
					<select className="job-text-input" id="job_status" value={details.job_status}
							onChange={ks("job_status", changeDetails)} >
							{this.props.selections.job_status.map(opt => {
								return <option key={opt}>{opt}</option>;
							})}
					</select>
				</div>
				<div className="job-details-field">
					<label htmlFor="ordertype">Order Type:</label>
					<select className="job-text-input" id="ordertype" value={details.order_type}
							onChange={ks("order_type", changeDetails)} >
						{this.props.selections.order_type.map(opt => {
							return <option key={opt}>{opt}</option>;
						})}
					</select>
				</div>
				<div className="job-details-field">
					<label htmlFor="lastupdate">Last Update:</label>
					<input type="date" value={details.last_update} className="job-text-input" id="lastupdate"
							disabled readOnly/>
				</div>
				<div className="job-details-field">
					<label htmlFor="partsstatus">Parts Status:</label>
					<select className="job-text-input" id="partsstatus" value={details.parts_status}
							onChange={ks("parts_status", changeDetails)} >
							{this.props.selections.parts_status.map(opt => {
								return <option key={opt}>{opt}</option>;
							})}
					</select>
				</div>
				<div className="job-details-field notes">
					<label htmlFor="partsnotes">Parts Notes:</label>
					<textarea type="text" className="job-text-area" id="partsnotes" value={details.parts_notes}
							onChange={ks("parts_notes", changeDetails)} />
				</div>
			</div>

			<div className="job-details-column u-flex-grow3">
				<div className="job-details-field">
					<label htmlFor="shippingdate">Shipping Date:</label>
					<input type="date" value={details.shipping_date} className="job-text-input" id="shippingdate"
							onChange={ks("shipping_date", changeDetails)} />
				</div>
				<div className="job-details-field notes u-flex-grow2">
					<label htmlFor="notes">Delivery Details:</label>
					<textarea type="text" className="job-text-area u-flex-grow2" id="notes" value={details.delivery_details}
							onChange={ks("delivery_details", changeDetails)} />
				</div>
			</div>

			<div className="job-details-column">
				<div className="job-details-field">
					<input type="button" value="pdf" onClick={getPDF.bind(this, details.job_id)}/>
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
