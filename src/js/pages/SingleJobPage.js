"use strict";
import React, { Component, PropTypes } from "react";
import Table from "../components/table/Table";
import NavBar from "../components/common/NavBar";
import Alert from "../components/common/Alert";
import Modal from "../components/common/Modal";
import SingleJobDetails from "../components/details/SingleJobDetails";
import connectToStores from "../utils/connectToStores";
import SingleJobStore from "../stores/SingleJobStore";
import SelectionStore from "../stores/SelectionStore";
import AlertStore from "../stores/AlertStore";
import ModalStore from "../stores/ModalStore";
import * as ModalActionCreators from "../actions/ModalActionCreators";
import * as SingleJobActionCreators from "../actions/SingleJobActionCreators";
import * as SharedActionCreators from "../actions/SharedActionCreators";
import rbPrefixer from "../utils/rbPrefixer";
import yyyyMMdd from "../utils/yyyyMMdd";


function requestDataFromServer(id) {
	SharedActionCreators.getSelections();
	SharedActionCreators.getAllProducts();
	SingleJobActionCreators.getSingleJob(id);
}

class SingleJobPage extends Component {

	componentWillMount() {
		requestDataFromServer(this.props.params.id);
	}

	render() {
		return (
			<div>
				<NavBar title={`RB${this.props.params.id}`} >
					{(this.props.isLoading || this.props.alert) ?
						<Alert isLoading={this.props.isLoading} isUnsaved={this.props.isUnsaved}
							alert={this.props.alert} /> :
						<span />
					}
					<img src="/img/transparent.gif" className="logo" />
				</NavBar>
				<NavBar routeConfig={this.props.routeScheme}>
					<div className="nav nav-item logout">
						<a href="/logout">Logout</a>
					</div>
				</NavBar>
				{this.props.pendingAction ?
					<Modal isVisible={!!this.props.pendingAction} title={"Are you sure you want to delete this job item?"}
							hide={ModalActionCreators.clearPendingAction}>
						<button className="confirm-delete" autoFocus
								onClick={ModalActionCreators.executePendingAction.bind(null, this.props.pendingAction)}>
							Confirm
						</button>
					</Modal> :
					<span />
				}
				<div className="container">
					<SingleJobDetails details={this.props.details} selections={this.props.selections}
						detailsConfig={this.props.detailsScheme} onBlur={SharedActionCreators.saveDetails}>
						<button className="add-button rounded"
								onClick={SharedActionCreators.createItem.bind(this, this.props.details.get("job_id"), {})}>
							Add Job Item
						</button>
					</SingleJobDetails>
					<div className="table-container">
						<Table selections={this.props.selections}
								filters={this.props.filters}
								items={this.props.items} primaryKey={"item_id"}
								tableScheme={this.props.tableScheme}
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
	const details = SingleJobStore.getJobDetails();
	const items = SingleJobStore.getSortedItems();
	const filters = SingleJobStore.getFilters();
	const selections = SelectionStore.getSelections();
	const pendingAction = ModalStore.getPendingAction();
	const isLoading = AlertStore.getLoadStatus();
	const isUnsaved = AlertStore.getUnsavedStatus();
	const alert = AlertStore.getAlert();

	return {
		selections,
		items,
		details,
		filters,
		pendingAction,
		isLoading,
		isUnsaved,
		alert
	};
}

export default connectToStores([SingleJobStore, SelectionStore, AlertStore, ModalStore], getState)(SingleJobPage);

SingleJobPage.defaultProps = {
	tableScheme: [
		{ key: "-", 	        display: "", className: "fixed-col hid", type: "button",   onClick: ModalActionCreators.modifyPendingAction.bind(null, SharedActionCreators.deleteItem), inputClassName: "btn-left" },
		{ key: "product",     display: "Product",             otherContent: "pdf", className: "",                        type: "select",   onChange: SharedActionCreators.changeItem },
		{ key: "description", display: "Description",         otherContent: "pdf", className: "u-flex-grow2",            type: "textarea", onChange: SharedActionCreators.changeItem },
		{ key: "glass",       display: "Glass",               otherContent: "pdf", className: "",                        type: "select",   onChange: SharedActionCreators.changeItem },
		{ key: "metal",       display: "Metal",               otherContent: "pdf", className: "",                        type: "select",   onChange: SharedActionCreators.changeItem },
		{ key: "flex",        display: "Flex",                otherContent: "pdf", className: "",                        type: "select",   onChange: SharedActionCreators.changeItem },
		{ key: "bulb",        display: "Bulb",                otherContent: "pdf", className: "",                        type: "select",   onChange: SharedActionCreators.changeItem },
		{ key: "qty_req",     display: "Qty", line2: "Req", otherContent: "pdf",   className: "qty-sm",   type: "number",   onChange: SharedActionCreators.changeItem, isNum: true },
		{ key: "qty_hot",     display: "Qty", line2: "Hot", className: "qty-sm",   type: "number",   onChange: SharedActionCreators.changeItem, isNum: true },
		{ key: "qty_cold",    display: "Qty", line2: "Cold",                       className: "qty-sm",  type: "number",   onChange: SharedActionCreators.changeItem, isNum: true },
		{ key: "qty_assem",   display: "Qty", line2: "Assem",                      className: "qty-sm", type: "number",   onChange: SharedActionCreators.changeItem, isNum: true },
		{ key: "notes",       display: "Notes",        className: "u-flex-grow3",            type: "textarea", onChange: SharedActionCreators.changeItem },
		{ key: "+", 	        display: "",             className: "fixed-col hid",           type: "button",   onClick: SharedActionCreators.createItem, inputClassName: "btn-right" }
	],
	detailsScheme: [
		{ key: "job_id",         display: "Job #:",            className: "",                   type: "text",     formattingFunc: rbPrefixer },
		{ key: "client",         display: "Client:",           className: "",                   type: "text",     onChange: SharedActionCreators.changeDetails },
		{ key: "project",        display: "Project:",          className: "",                   type: "text",     onChange: SharedActionCreators.changeDetails },
		{ key: "client_ref",     display: "Client Ref:",       className: "",                   type: "text",     onChange: SharedActionCreators.changeDetails },
		{ key: "notes",          display: "Notes:",            className: "u-flex-grow2 notes", type: "textarea", onChange: SharedActionCreators.changeDetails },
		{ key: "job_status",     display: "Job Status:",       className: "",                   type: "select",   onChange: SharedActionCreators.changeDetails },
		{ key: "order_type",     display: "Order Type:",       className: "",                   type: "select",   onChange: SharedActionCreators.changeDetails },
		{ key: "updatedat",      display: "Last Update:",      className: "",                   type: "date",     formattingFunc: yyyyMMdd },
		{ key: "parts_status",   display: "Parts Status:",     className: "",                   type: "select",   onChange: SharedActionCreators.changeDetails },
		{ key: "parts_notes",    display: "Parts Notes:",      className: "u-flex-grow2 notes", type: "textarea", onChange: SharedActionCreators.changeDetails },
		{ key: "payment",        display: "Payment:",          className: "",                   type: "select",   onChange: SharedActionCreators.changeDetails },
		{ key: "shipping_date",  display: "Shipping Date:",    className: "",                   type: "date",     onChange: SharedActionCreators.changeDetails },
		{ key: "shipping_notes", display: "Delivery Details:", className: "u-flex-grow2 notes", type: "textarea", onChange: SharedActionCreators.changeDetails }
	],
	routeScheme: [
		{ display: "Jobs", "to": "jobs" },
		{ display: "Items", "to": "items" },
		{ display: "Products", to: "products"}
	]
};
