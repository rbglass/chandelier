"use strict";
import { Component, PropTypes } from "react";
import DetailsColumn from "./DetailsColumn";

export default class Details extends Component {
	render() {

		return (
			<div className="job-details">
				<DetailsColumn />
				<DetailsColumn />
				<DetailsColumn />
				<DetailsColumn />
			</div>
		);
	}
}

Details.propTypes = {

};
