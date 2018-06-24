"use strict";
import React, { Component, PropTypes } from "react";
import DocumentTitle from "react-document-title";
import Table from "../components/table/Table";
import Filter from "../components/filter/Filter";
import NavBar from "../components/common/NavBar";
import Alert from "../components/common/Alert";
import UserProfile from "../components/common/UserProfile";
import connectToStores from "../utils/connectToStores";
import SelectionStore from "../stores/SelectionStore";
import ItemsStore from "../stores/ItemsStore";
import AlertStore from "../stores/AlertStore";
import UserStore from "../stores/UserStore";
import PaginationStore from "../stores/PaginationStore";
import * as JobItemsActionCreators from "../actions/JobItemsActionCreators";
import * as SharedActionCreators from "../actions/SharedActionCreators";
import { ddMMMyyyy } from "../utils/yyyyMMdd";
import rbPrefixer from "../utils/rbPrefixer";

function requestDataFromServer() {
	SharedActionCreators.getUserProfile();
	SharedActionCreators.getSelections();
	SharedActionCreators.getAllProducts();
	JobItemsActionCreators.getAllItems();
}

class JobItemsPage extends Component {

	componentWillMount() {
		requestDataFromServer();
	}

	componentWillUnmount() {
		SharedActionCreators.setCurrentY(0);
	}

	render() {
		const shouldDisplayAlert = this.props.isLoading ||
																this.props.isUnsaved ||
																this.props.hasChanged ||
																this.props.alert;

		return (
			<DocumentTitle title="Job Items — R&B">
				<div>
					<NavBar title={"All Items"} >
						{(shouldDisplayAlert) ?
							<Alert isLoading={this.props.isLoading} isUnsaved={this.props.isUnsaved}
								hasChanged={this.props.hasChanged} alert={this.props.alert} /> :
							<span />
						}
						<img src="/img/transparent.gif" className="logo" />
					</NavBar>
					<NavBar routeConfig={this.props.routeScheme}>
						<div className="nav nav-item logout">
							<a href="/logout">Logout</a>
						</div>
						<UserProfile
							user={this.props.profile.get("user")}
							avatar={this.props.profile.get("avatar")}
						/>
					</NavBar>
					<div className="container">
						<Filter filters={this.props.filters} selections={this.props.selections}
							setFilter={JobItemsActionCreators.setFilter}
							setStartDate={JobItemsActionCreators.setStartDate}
							setEndDate={JobItemsActionCreators.setEndDate}
							restrictTo={JobItemsActionCreators.restrictTo}
							presetConfig={this.props.presetScheme}
							numberOfRows={this.props.numberOfItems}
						/>
						<div className="table-container">
							<Table selections={this.props.selections}
								filters={this.props.filters}
								items={this.props.items} primaryKey={"item_id"}
								tableScheme={this.props.tableScheme}
								onBlur={SharedActionCreators.saveItem}
								sortFunc={SharedActionCreators.externalSortBy.bind(null, "items")}
								start={this.props.start}
								end={this.props.end}
								total={this.props.numberOfItems}
								currentY={this.props.currentY}
								rowHeight={this.props.rowHeight}
								onResize={SharedActionCreators.setTableHeight}
								onScroll={SharedActionCreators.setCurrentY}
								isInfinite
							/>
						</div>
					</div>
				</div>
			</DocumentTitle>
		);
	}
}

function getState() {
	const start = Math.max(0, PaginationStore.getDisplayStart() || 0);
	const end = PaginationStore.getDisplayEnd();
	const rowHeight = PaginationStore.getRowHeight();
	const currentY = PaginationStore.getCurrentY();

	const items = ItemsStore.getFilteredItems(start, end);
	const filters = ItemsStore.getFilters();
	const numberOfItems = ItemsStore.getNumberOfItems();
	const selections = SelectionStore.getSelections();

	const hasChanged = AlertStore.getChangedStatus();
	const isLoading = AlertStore.getLoadStatus();
	const isUnsaved = AlertStore.getUnsavedStatus();
	const alert = AlertStore.getAlert();
	const profile = UserStore.getProfile();

	return {
		start,
		end,
		rowHeight,
		selections,
		currentY,
		items,
		filters,
		numberOfItems,
		hasChanged,
		isLoading,
		isUnsaved,
		alert,
		profile
	};
}

export default connectToStores([
	ItemsStore, SelectionStore,
	AlertStore, PaginationStore,
	UserStore
], getState)(JobItemsPage);

const clearPreset = [
	SharedActionCreators.externalSortBy.bind(null, "items", "shipping_date", false),
	JobItemsActionCreators.clearItemsFilters
];

// Code too wide
JobItemsPage.defaultProps = {
	tableScheme: [
		{ key: "job_id",        display: "Job #", otherContent: "pdf", className: "qty-sm link",
					type: "link",     formattingFunc: rbPrefixer, to: "singlejob"},

		{ key: "client",        display: "Client", otherContent: "pdf", className: "",
					type: "" },

		{ key: "product",       display: "Product", otherContent: "pdf", className: "u-flex-grow2",
					type: "select",   onChange: SharedActionCreators.changeItem },

		{ key: "description",   display: "Description", otherContent: "pdf", maxRows: 3,
					className: "u-flex-grow2", type: "textarea", onChange: SharedActionCreators.changeItem },

		{ key: "job_status",    display: "Job Status", otherContent: "pdf", className: "",
					type: "select", colored: true  },

		{ key: "shipping_date", display: "Shipping Date", otherContent: "pdf", className: "",
					type: "",         formattingFunc: ddMMMyyyy  },

		{ key: "parts_status",  display: "Parts Status",
					className: "",  type: "select" },

		{ key: "qty_req",       display: "Qty", line2: "Req", otherContent: "pdf", className: "qty-sm",
					type: "number",   onChange: SharedActionCreators.changeItem,   isNum: true },

		{ key: "qty_hot",       display: "Qty", line2: "Hot", className: "qty-sm", conditional: true,
					type: "number",   onChange: SharedActionCreators.changeItem,   isNum: true },

		{ key: "qty_cold",      display: "Qty", line2: "Cold",  className: "qty-sm", conditional: true,
					type: "number",   onChange: SharedActionCreators.changeItem,   isNum: true },

		{ key: "qty_assem",     display: "Qty", line2: "Assem", className: "qty-sm", conditional: true,
					type: "number",   onChange: SharedActionCreators.changeItem,   isNum: true },
		{ key: "qty_packed",     display: "Qty", line2: "Packed", className: "qty-sm", conditional: true,
					type: "number",   onChange: SharedActionCreators.changeItem,   isNum: true },
		{ key: "glass",         display: "Glass", otherContent: "pdf", className: "u-flex-grow2",
					type: "select",   onChange: SharedActionCreators.changeItem                },

		{ key: "metal",         display: "Metal", otherContent: "pdf", className: "u-flex-grow2",
					type: "select",   onChange: SharedActionCreators.changeItem                },

		{ key: "flex",          display: "Flex", otherContent: "pdf", className: "u-flex-grow2",
					type: "select",   onChange: SharedActionCreators.changeItem                },
		{ key: "flex_length",   display: "Flex", line2: "Length (m)", otherContent: "pdf", className: "u-flex-grow2",
					type: "number",   onChange: SharedActionCreators.changeItem},

		{ key: "bulb",          display: "Bulb", otherContent: "pdf", className: "u-flex-grow2",
					type: "select",   onChange: SharedActionCreators.changeItem                },
		{ key: "ceilingrose",  display: "CeilingRose", otherContent: "pdf", className: "u-flex-grow2",
					type: "select",   onChange: SharedActionCreators.changeItem},

		{ key: "notes",         display: "Notes", className: "u-flex-grow2", maxRows: 3,
					type: "textarea", onChange: SharedActionCreators.changeItem   }
	],
	presetScheme: [
		{
			description: "Clear All Filters",
			onSelect: clearPreset
		},
		{
			description: "Live Items",
			onSelect: [
				SharedActionCreators.externalSortBy.bind(null, "items", "shipping_date", false),
				JobItemsActionCreators.defaultItemsFilters
			]
		},
		{
			description: "Within 3 weeks & confirmed",
			onSelect: clearPreset.concat([
				JobItemsActionCreators.restrictTo.bind(null, "job_status", ["Confirmed", "Packaged", "Dispatched"]),
				JobItemsActionCreators.setStartDate.bind(null, new Date()),
				JobItemsActionCreators.setEndDate.bind(null, new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 3))
			])
		},
		{
			description: "Hot Items",
			onSelect: [
				JobItemsActionCreators.filterByPredicate.bind("qty_hot", x => x > 0),
				JobItemsActionCreators.defaultItemsFilters
			]
		}//,
		// {
		// 	description: "Borosilicate",
		// 	onSelect: clearPreset.concat([
		// 		JobItemsActionCreators.restrictTo.bind(null, "product",
		// 			["Spindle Pendant 3-Bubble", "Spindle Pendant 4-Bubble", "Tiered Light", "Spindle Shade"]
		// 		)
		// 	])
		// }
	],
	routeScheme: [ 
		{ display: "Jobs", "to": "jobs" },
		{ display: "Items", "to": "items" },
		{ display: "Products", to: "products"}
	]

};
