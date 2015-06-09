"use strict";
import React, { Component, PropTypes } from "react";
import Table from "../components/common/Table";
import NavBar from "../components/common/NavBar";
import connectToStores from "../utils/connectToStores";
import SelectionStore from "../stores/SelectionStore";
import JobItemsStore from "../stores/JobItemsStore";
import * as JobItemsActionCreators from "../actions/JobItemsActionCreators";
import * as SharedActionCreators from "../actions/SharedActionCreators";

function requestDataFromServer() {
	SharedActionCreators.getSelections();
	JobItemsActionCreators.getAllItems();
}

class JobItemsPage extends Component {

	componentWillMount() {
		requestDataFromServer();
	}

	render() {
		return (
			<div>
				<NavBar title="All Items"/>
				<div className="container">
					{/* <Filter {...this.props} /> */}
					<Table {...this.props} primaryKey={"item_id"}/>
				</div>
			</div>
		);
	}
}

function getState() {
	const items = JobItemsStore.getJobItems();
	const filters = JobItemsStore.getFilters();
	const selections = SelectionStore.getSelections();

	return {
		selections,
		items,
		filters
	};
}

export default connectToStores([JobItemsStore, SelectionStore], getState)(JobItemsPage);

JobItemsPage.defaultProps = {
	tableScheme: [
		{ key: "-",           display: "",            className: "fixed-col", type: "button", inputClassName: "btn-left" },
		{ key: "item_id",     display: "Item",        className: "qty-sm", type: "" },
		{ key: "product",     display: "Product",     className: "", type: "text" },
		{ key: "description", display: "Description", className: "u-flex-grow3", type: "textarea" },
		{ key: "glass",       display: "Glass",       className: "", type: "text" },
		{ key: "metal",       display: "Metal",       className: "", type: "text"  },
		{ key: "flex",        display: "Flex",        className: "", type: "text"  },
		{ key: "bulb",        display: "Bulb",        className: "", type: "text"  },
		{ key: "qty_req",     display: "Qty Req",     className: "qty-sm", type: "number" },
		{ key: "qty_hot",     display: "Qty Hot",     className: "qty-sm", type: "number" },
		{ key: "qty_cold",    display: "Qty Cold",    className: "qty-sm", type: "number" },
		{ key: "qty_assem",   display: "Qty Assem",   className: "qty-md", type: "number" },
		{ key: "qty_packed",  display: "Qty Packed",  className: "qty-md", type: "number" },
		{ key: "notes",       display: "Notes",       className: "u-flex-grow3", type: "textarea" },
		{ key: "+", 	        display: "",            className: "fixed-col", type: "button", inputClassName: "btn-right"}
	]
};
