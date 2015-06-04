"use strict";
import React, { Component, PropTypes } from "react";

export default class SingleJobTableHeader extends Component {
	render() {

		return (
			<div className="table-row table-header">
				<div className="table-row-item fixed-col"></div>
				<div className="table-row-item">Item #</div>
				<div className="table-row-item">Product</div>
				<div className="table-row-item u-flex-grow3">Description</div>
				<div className="table-row-item">Glass</div>
				<div className="table-row-item">Metal</div>
				<div className="table-row-item">Flex</div>
				<div className="table-row-item">Bulb</div>
				<div className="table-row-item qty-sm">Qty Req</div>
				<div className="table-row-item qty-sm">Qty Hot</div>
				<div className="table-row-item qty-sm">Qty Cold</div>
				<div className="table-row-item qty-md">Qty Assem</div>
				<div className="table-row-item qty-md">Qty Packed</div>
				<div className="table-row-item u-flex-grow3">Notes</div>
				<div className="table-row-item fixed-col"></div>
			</div>
		);
	}
}

SingleJobTableHeader.propTypes = {

};
