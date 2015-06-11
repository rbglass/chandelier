"use strict";
import React, { Component, PropTypes } from "react";
import Table from "../components/common/Table";
import NavBar from "../components/common/NavBar";
import Filter from "../components/common/Filter";
import Alert from "../components/common/Alert";
import connectToStores from "../utils/connectToStores";
import SelectionStore from "../stores/SelectionStore";
import ItemsStore from "../stores/ItemsStore";
import * as JobItemsActionCreators from "../actions/JobItemsActionCreators";
import * as SharedActionCreators from "../actions/SharedActionCreators";
import yyyyMMdd from "../utils/yyyyMMdd";

function requestDataFromServer() {
	SharedActionCreators.getSelections();
	SharedActionCreators.getAllProducts();
	JobItemsActionCreators.getAllItems();
}

class JobItemsPage extends Component {

	componentWillMount() {
		requestDataFromServer();
	}

	render() {
		return (
			<div>
				<NavBar title="All Items" routeConfig={this.props.routeScheme}/>
				{(this.props.isLoading || this.props.alert) ?
					<Alert isLoading={this.props.isLoading} alert={{type: "error"}} /> :
					<span />
				}
				<div className="container">
					<Filter filters={this.props.filters} selections={this.props.selections}
						setFilter={SharedActionCreators.setFilter} setStartDate={SharedActionCreators.setStartDate}
						setEndDate={SharedActionCreators.setEndDate}
						restrictTo={SharedActionCreators.restrictTo}
					/>
					<div className="table-container">
						<Table {...this.props} primaryKey={"item_id"}
							onBlur={SharedActionCreators.saveItem}
							sortFunc={SharedActionCreators.sortBy}
						/>
					</div>
				{/* <button className="add-button" onClick={SharedActionCreators.createItem.bind(this, null, {})}>+</button> */}
				</div>
			</div>
		);
	}
}

function getState() {
	const items = ItemsStore.getFilteredAndSortedItems();
	const filters = ItemsStore.getFilters();
	const selections = SelectionStore.getSelections();
	const isLoading = ItemsStore.getLoadStatus();

	return {
		selections,
		items,
		filters,
		isLoading
	};
}

export default connectToStores([ItemsStore, SelectionStore], getState)(JobItemsPage);

JobItemsPage.defaultProps = {
	tableScheme: [
		{ key: "-",           display: "",            className: "fixed-col hid", type: "button",    onClick:SharedActionCreators.deleteItem,
				inputClassName: "btn-left" },
		{ key: "job_id",        display: "Job #",         "className": "qty-sm",   type: "link", to: "singlejob" },
		// { key: "item_id",     display: "Item",        className: "qty-sm",       type: "" },
		{ key: "product",     display: "Product",     className: "u-flex-grow2",  type: "select",   onChange: SharedActionCreators.changeItem   },
		{ key: "description", display: "Description", className: "u-flex-grow2",  type: "textarea", onChange: SharedActionCreators.changeItem   },
		{ key: "shipping_date", display: "Shipping Date", "className": "", type: "", formattingFunc: yyyyMMdd  },
		{ key: "glass",       display: "Glass",       className: "u-flex-grow2",  type: "select",   onChange: SharedActionCreators.changeItem   },
		{ key: "metal",       display: "Metal",       className: "u-flex-grow2",  type: "select",   onChange: SharedActionCreators.changeItem   },
		{ key: "flex",        display: "Flex",        className: "u-flex-grow2",  type: "select",   onChange: SharedActionCreators.changeItem   },
		{ key: "bulb",        display: "Bulb",        className: "u-flex-grow2",  type: "select",   onChange: SharedActionCreators.changeItem   },
		{ key: "qty_req",     display: "Qty Req",     className: "qty-sm",        type: "number",   onChange: SharedActionCreators.changeItem   },
		{ key: "qty_hot",     display: "Qty Hot",     className: "qty-sm",        type: "number",   onChange: SharedActionCreators.changeItem   },
		{ key: "qty_cold",    display: "Qty Cold",    className: "qty-sm",        type: "number",   onChange: SharedActionCreators.changeItem   },
		{ key: "qty_assem",   display: "Qty Assem",   className: "qty-md",        type: "number",   onChange: SharedActionCreators.changeItem   },
		{ key: "qty_packed",  display: "Qty Packed",  className: "qty-md",        type: "number",   onChange: SharedActionCreators.changeItem   },
		{ key: "notes",       display: "Notes",       className: "u-flex-grow2",  type: "textarea", onChange: SharedActionCreators.changeItem   },
		{ key: "+", 	        display: "",            className: "fixed-col hid", type: "button",    onClick: SharedActionCreators.createItem,
				inputClassName: "btn-right"}
	],
	routeScheme: [
		{ display: "Jobs", "to": "jobs" },
		{ display: "Items", "to": "items" }
	]

};
