"use strict";
import I from "immutable";
import IPropTypes from "react-immutable-proptypes";
import React, { Component, PropTypes } from "react";
import DateSelector from "../common/DateSelector";
import Select from "../table/Select";
import keySealer from "../../utils/keySealer";
import yyyyMMdd from "../../utils/yyyyMMdd";

export default class SingleJobDetails extends Component {
	shouldComponentUpdate(nextProps) {
		const shouldit = nextProps.details !== this.props.details ||
											nextProps.selections !== this.props.selections;
		return shouldit;
	}

	handleBlur(e) {
		const currentNode = e.target && e.target.parentElement.parentElement;
		const destinationNode = e.relatedTarget && e.relatedTarget.parentElement.parentElement;

		if(currentNode !== destinationNode) {
			this.props.onBlur(this.props.details.get("job_id"), this.props.details);
		}
	}

	render() {
		const details = this.props.details;
		const config = this.props.detailsConfig;
		const ks = keySealer.bind(this, details.get("job_id"));
		let columns = [];
		let n = 0;

		config.forEach((cell, i) => {
			let cellValue = details.get(cell.key);
			let input;
			let field;
			let isDisabled;
			let isUndefined;

			switch (cell.type) {

				case "text":
						isDisabled = !cell.onChange;
						isUndefined = cellValue === undefined;
						input = (
							<input type="text"
									value={isUndefined ? "" : cell.formattingFunc ? cell.formattingFunc(cellValue) : cellValue}
									className="job-text-input" id={cellValue}
									disabled={isDisabled} readOnly={isDisabled} />
						);
						break;

				case "date":
						isDisabled = !cell.onChange;
						input = <DateSelector value={cellValue} readOnly={isDisabled} disabled={isDisabled}
											id={cellValue} className="job-text-input" inputClass="clearable"/>;
						break;

				case "select":
						input = <Select value={cellValue} className="job-text-input"
												selections={this.props.selections.get(cell.key)} colored={cell.colored}/>;
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
							<div className="job-details-column job-details-form" key={z}>
								{col}
							</div>
						);
					})
				}
				<div className="job-details-column">
					<div className="job-details-field job-buttons">
						<a href={`/api/jobs/${details.get("job_id")}?pdf=true`} target="_blank">
							<input className="pdfButton" type="button" value="PDF"/>
						</a>
						{this.props.children || null}
					</div>
				</div>
			</div>
		);
	}
}

SingleJobDetails.propTypes = {
	details: IPropTypes.map,
	selections: IPropTypes.mapOf(
		IPropTypes.listOf(
			PropTypes.oneOfType([
				PropTypes.string, IPropTypes.map
			])
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
