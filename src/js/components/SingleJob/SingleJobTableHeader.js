"use strict";
import React, { Component, PropTypes } from "react";
import { sortBy } from "../../actions/JobsActionCreators";

const headers = [
	{ key: "item", 	      display: "Item",        className: "" },
  { key: "product",     display: "Product",     className: "" },
  { key: "description", display: "Description", className: "u-flex-grow3" },
  { key: "glass",       display: "Glass",       className: "" },
  { key: "metal",       display: "Metal",       className: "" },
  { key: "flex",        display: "Flex",        className: "" },
  { key: "bulb",        display: "Bulb",        className: "" },
  { key: "qty_req",     display: "Qty Req",     className: "qty-sm" },
  { key: "qty_hot",     display: "Qty Hot",     className: "qty-sm" },
  { key: "qty_cold",    display: "Qty Cold",    className: "qty-sm" },
  { key: "qty_assem",   display: "Qty Assem",   className: "qty-md" },
  { key: "qty_packed",  display: "Qty Packed",  className: "qty-md" },
  { key: "notes",       display: "Notes",       className: "u-flex-grow3" }
];

export default class SingleJobTableHeader extends Component {
	render() {
		const headerSet = headers.map(e => {
			var sortDirection = "";

			if(this.props.filters.sortTerm === e.key) {
				sortDirection += this.props.filters.isAsc ? "asc" : "desc";
			}

			var divClass = `table-row-item ${e.className} ${sortDirection}`;
			return (
				<div key={e.key} className={divClass} onClick={sortBy.bind(null, e.key)}>{e.display}</div>
			);
		});

		return (
			<div className="table-row table-header">
				<div className="table-row-item fixed-col"></div>
				{headerSet}
				<div className="table-row-item fixed-col"></div>
			</div>
		);
	}
}

SingleJobTableHeader.propTypes = {

};
