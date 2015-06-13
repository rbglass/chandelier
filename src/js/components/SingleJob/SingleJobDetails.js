"use strict";
import React, { Component, PropTypes } from "react";
import keySealer from "../../utils/keySealer";
import yyyyMMdd from "../../utils/yyyyMMdd";

export default class SingleJobDetails extends Component {
	handleBlur(e) {
		const currentNode = e.target && e.target.parentElement.parentElement;
		const destinationNode = e.relatedTarget && e.relatedTarget.parentElement.parentElement;

		if(currentNode !== destinationNode) {
			this.props.onBlur(this.props.details.job_id, this.props.details);
		}
	}

	render() {
		const details = this.props.details;
		const config = this.props.detailsConfig;
		const ks = keySealer.bind(this, details.job_id);
		let columns = [];
		let n = 0;

		config.forEach((cell, i) => {
			let cellValue = details[cell.key];
			let input;
			let field;

			switch (cell.type) {

				case "text":
						let isDisabled = !cell.onChange;
						input = (
							<input type="text" value={cell.formattingFunc ? cell.formattingFunc(cellValue) : cellValue}
									className="job-text-input" id={cellValue}
									disabled={isDisabled} readOnly={isDisabled} />
						);
						break;

				case "date":
						let isDisabled = !cell.onChange;
						input = (
							<input type="date" value={yyyyMMdd(cellValue)}
									className="job-text-input" id={cellValue}
									disabled={isDisabled} readOnly={isDisabled} />
						);
						break;

				case "select":
						input = (
							<select value={cellValue} className="job-text-input">
								<option></option>
								{ this.props.selections[cell.key] ?
									this.props.selections[cell.key].map((opt, j) => {
									return <option key={opt + " " + j}>{opt}</option>;
								}, this) : "No opts" }
							</select>
						);
						break;

				case "textarea":
						input = (
							<textarea type="text" className={`job-text-area ${cell.className || ""}`}
									id={cellValue} value={cellValue} />
						);
						break;

				default:
						break;
			}

			field = (
				<div className={`job-details-field ${cell.className || ""}`} key={i}
						onChange={cell.onChange ? ks(cell.key, cell.onChange) : null}>
					<label htmlFor={cellValue}>{cell.display}</label>
					{input}
				</div>
			);

			if (!columns[n]) {
				columns[n] = [];
			}
			columns[n].push(field);

			if(cell.type === "textarea") n += 1;
		});

		return (
			<div className="job-details" onBlur={this.handleBlur.bind(this)}>
				{ columns.map((col, z) => {
						return (
							<div className="job-details-column u-flex-grow3" key={z}>
								{col}
							</div>
						);
					})
				}
				<div className="job-details-column">
					<div className="job-details-field">
						<a href={`/api/jobs/${details.job_id}?pdf=true`} target="_blank">
							<input className="pdfButton" type="button" value="PDF"/>
						</a>
					</div>
				</div>
			</div>
		);
	}
}

SingleJobDetails.propTypes = {
	details: PropTypes.object,
	selections: PropTypes.objectOf(
		PropTypes.arrayOf(
			PropTypes.string
		)
	),
	detailsConfig: PropTypes.arrayOf(PropTypes.shape({
		key: PropTypes.string.isRequired,
		type: PropTypes.string,
		onChange: PropTypes.func,
		to: PropTypes.string,
		className: PropTypes.string,
		inputClassName: PropTypes.string
	})),
	onBlur: PropTypes.func
};
