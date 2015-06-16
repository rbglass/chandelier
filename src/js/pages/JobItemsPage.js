"use strict";
import React, { Component, PropTypes } from "react";
import Table from "../components/common/Table";
import NavBar from "../components/common/NavBar";
import Filter from "../components/common/Filter";
import Alert from "../components/common/Alert";
import DateSelector from "../components/common/DateSelector";
import connectToStores from "../utils/connectToStores";
import SelectionStore from "../stores/SelectionStore";
import ItemsStore from "../stores/ItemsStore";
import AlertStore from "../stores/AlertStore";
import * as JobItemsActionCreators from "../actions/JobItemsActionCreators";
import * as SharedActionCreators from "../actions/SharedActionCreators";
import { ddMMyyyy } from "../utils/yyyyMMdd";
import rbPrefixer from "../utils/rbPrefixer";

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
					<Alert isLoading={this.props.isLoading} alert={this.props.alert} /> :
					<span />
				}
				<div className="container">
					<Filter filters={this.props.filters} selections={this.props.selections}
						setFilter={SharedActionCreators.setFilter} setStartDate={SharedActionCreators.setStartDate}
						setEndDate={SharedActionCreators.setEndDate}
						restrictTo={SharedActionCreators.restrictTo}
						presetConfig={this.props.presetScheme}
					/>
					<div className="table-container">
						<Table {...this.props} primaryKey={"item_id"}
							onBlur={SharedActionCreators.saveItem}
							sortFunc={SharedActionCreators.sortBy}
						/>
					</div>
				</div>
			</div>
		);
	}
}

function getState() {
	const items = ItemsStore.getFilteredAndSortedItems();
	const filters = ItemsStore.getFilters();
	const selections = SelectionStore.getSelections();
	const isLoading = AlertStore.getLoadStatus();
	const alert = AlertStore.getAlert();

	return {
		selections,
		items,
		filters,
		isLoading,
		alert
	};
}

export default connectToStores([ItemsStore, SelectionStore, AlertStore], getState)(JobItemsPage);

JobItemsPage.defaultProps = {
	routeScheme: [
		{ display: "Jobs", "to": "jobs" },
		{ display: "Items", "to": "items" }
	],
	tableScheme: [
		{ key: "-",             display: "",                               className: "fixed-col hid", type: "button",   onClick: SharedActionCreators.deleteItem, inputClassName: "btn-left" },
		{ key: "job_id",        display: "Job #",                          className: "qty-sm",        type: "link",     formattingFunc: rbPrefixer, to: "singlejob"},
		{ key: "product",       display: "Product",                        className: "u-flex-grow2",  type: "select",   onChange: SharedActionCreators.changeItem },
		{ key: "description",   display: "Description",                    className: "u-flex-grow2",  type: "textarea", onChange: SharedActionCreators.changeItem },
		{ key: "job_status",    display: "Job Status",                     className: "",              type: ""},
		{ key: "shipping_date", display: "Shipping Date",                  className: "",              type: "",         formattingFunc: ddMMyyyy  },
		{ key: "glass",         display: "Glass",                          className: "u-flex-grow2",  type: "select",   onChange: SharedActionCreators.changeItem                },
		{ key: "metal",         display: "Metal",                          className: "u-flex-grow2",  type: "select",   onChange: SharedActionCreators.changeItem                },
		{ key: "flex",          display: "Flex",                           className: "u-flex-grow2",  type: "select",   onChange: SharedActionCreators.changeItem                },
		{ key: "bulb",          display: "Bulb",                           className: "u-flex-grow2",  type: "select",   onChange: SharedActionCreators.changeItem                },
		{ key: "qty_req",       display: "Qty",            line2: "Req",   className: "qty-sm",        type: "number",   onChange: SharedActionCreators.changeItem,   isNum: true },
		{ key: "qty_hot",       display: "Qty",            line2: "Hot",   className: "qty-sm",        type: "number",   onChange: SharedActionCreators.changeItem,   isNum: true },
		{ key: "qty_cold",      display: "Qty",            line2: "Cold",  className: "qty-sm",        type: "number",   onChange: SharedActionCreators.changeItem,   isNum: true },
		{ key: "qty_assem",     display: "Qty",            line2: "Assem", className: "qty-sm",        type: "number",   onChange: SharedActionCreators.changeItem,   isNum: true },
		{ key: "notes",         display: "Notes",                          className: "u-flex-grow2",  type: "textarea", onChange: SharedActionCreators.changeItem   },
		{ key: "+", 	          display: "",                               className: "fixed-col hid", type: "button",   onClick: SharedActionCreators.createItem, inputClassName: "btn-right"}
	],
	presetScheme: [
		{
			description: "Within 2 weeks & job confirmed",
			onSelect: [
				SharedActionCreators.restrictTo.bind(null, "job_status", ["Confirmed", "Packaged"]),
				SharedActionCreators.setStartDate.bind(null, new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 * 2))
		]}
	]

};
