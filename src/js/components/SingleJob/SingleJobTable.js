"use strict";
import React, { Component, PropTypes } from "react";
import SingleJobTableHeader from "./SingleJobTableHeader";
import SingleJobTableRow from "./SingleJobTableRow";

export default class SingleJobTable extends Component {
	render() {
		const rows = this.props.items.map((item, i) => {
			return <SingleJobTableRow key={i} cells={item} />;
		});
		return (
			<div className="table">
				<SingleJobTableHeader filters={this.props.filters} />
				{rows}
			</div>
		);
	}
}

SingleJobTable.propTypes = {
	items: PropTypes.array
};
