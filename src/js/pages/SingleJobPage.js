"use strict";
import React, { Component, PropTypes } from "react";
import Table from "../components/common/Table";
import SingleJobTableRow from "../components/SingleJob/SingleJobTableRow";
import SingleJobDetails from "../components/SingleJob/SingleJobDetails";
import SingleJobStore from "../stores/SingleJobStore";
import connectToStores from "../utils/connectToStores";

class SingleJobPage extends Component {

	render() {
		return (
			<div>
				<h1 className="page-header">Single Job</h1>
				<SingleJobDetails details={this.props.details} />
				<Table {...this.props} />
			</div>
		);
	}
}

SingleJobPage.defaultProps = {
	headers: [
		{ key: "", 	      		display: "",        		className: "fixed-col" },
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
		{ key: "notes",       display: "Notes",       className: "u-flex-grow3" },
		{ key: "", 	      		display: "",        		className: "fixed-col" }
	],
	RowComponent: SingleJobTableRow
};


function getState() {
	const details = SingleJobStore.getJobDetails();
	const items = SingleJobStore.getSortedItems();
	const filters = SingleJobStore.getFilters();

	return {
		details,
		items,
		filters
	};
}

export default connectToStores([SingleJobStore], getState)(SingleJobPage);
