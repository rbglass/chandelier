"use strict";
import React, { Component, PropTypes } from "react";
import DocumentTitle from "react-document-title";
import Table from "../components/table/Table";
import NavBar from "../components/common/NavBar";
import Alert from "../components/common/Alert";
import Modal from "../components/common/Modal";
import UserProfile from "../components/common/UserProfile";
import SingleJobDetails from "../components/details/SingleJobDetails";
import connectToStores from "../utils/connectToStores";
import SingleJobStore from "../stores/SingleJobStore";
import SelectionStore from "../stores/SelectionStore";
import AlertStore from "../stores/AlertStore";
import ModalStore from "../stores/ModalStore";
import UserStore from "../stores/UserStore";
import * as ModalActionCreators from "../actions/ModalActionCreators";
import * as SingleJobActionCreators from "../actions/SingleJobActionCreators";
import * as SharedActionCreators from "../actions/SharedActionCreators";
import rbPrefixer from "../utils/rbPrefixer";
import yyyyMMdd from "../utils/yyyyMMdd";


function requestDataFromServer(id) {
	SharedActionCreators.getUserProfile();
	SharedActionCreators.getSelections();
	SharedActionCreators.getAllProducts();
	SingleJobActionCreators.getSingleJob(id);
}

class SingleJobPage extends Component {

	componentWillMount() {
		requestDataFromServer(this.props.params.id);
	}

	showMessage(contact_name, delivery_address, contact_email, contact_number, delivery_notes) {
		var textField = document.createElement('textarea')
		textField.innerText = ''
		textField.innerText = contact_name + ', ' + delivery_address + ', ' + contact_email + ', ' + contact_number + ', ' + delivery_notes
		document.body.appendChild(textField)
		textField.select()
		document.execCommand('copy')
		textField.remove()
	}

	render() {
		let modalTitle, modalChildren;
		const pending = this.props.pendingAction;
		const id = this.props.params.id;
		const client = this.props.details.get("client") || "";
		const contact_name = this.props.details.get("contact_name") || "";
		const delivery_address = this.props.details.get("delivery_address") || "";
		const contact_number = this.props.details.get("contact_number") || "";
		const contact_email = this.props.details.get("contact_email") || "";
		const delivery_notes = this.props.details.get("delivery_notes") || "";
		const title = `RB${id} ${client}`;

		const shouldDisplayAlert = this.props.isLoading ||
																this.props.isUnsaved ||
																this.props.hasChanged ||
																this.props.alert;

		if (pending) {
			if (pending.type === "DELETE") {
				modalTitle = "Are you sure you want to delete this job item?";
				modalChildren = (
					<button className="confirm-delete" autoFocus
							onClick={ModalActionCreators.executePendingAction.bind(null, this.props.pendingAction.action)}>
						Confirm
					</button>
				);
			}
		}

		return (
			<DocumentTitle title={`${title}  — R&B`}>
				<div>
					<NavBar title={title} >
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
					{pending ?
						<Modal isVisible={!!pending.type} title={modalTitle}
								hide={ModalActionCreators.clearPendingAction}>
							{modalChildren}
						</Modal> :
						null
					}
					<div className="container">
						<SingleJobDetails details={this.props.details} selections={this.props.selections}
							detailsConfig={this.props.detailsScheme} onBlur={SharedActionCreators.saveDetails} >
							
						</SingleJobDetails>
					<div className="buttonRow">
						
						<button className="add-button rounded"
									onClick={SharedActionCreators.createItem.bind(this, this.props.details.get("job_id"), {})}>
								Add Job Item
							</button>
							<button className="add-button rounded"
									onClick={this.showMessage(contact_name, delivery_address, contact_email, contact_number, delivery_notes)}>
								Clipboard
							</button>
							</div>
						<div className="table-container">
							<Table selections={this.props.selections}
									filters={this.props.filters}
									items={this.props.items} primaryKey={"item_id"}
									tableScheme={this.props.tableScheme}
									onBlur={SharedActionCreators.saveItem}
									sortFunc={SharedActionCreators.sortBy}
									focusOnEntry={true}
							/>
						</div>
					</div>
				</div>
			</DocumentTitle>
		);
	}
}


function getState() {
	const details = SingleJobStore.getJobDetails();
	const items = SingleJobStore.getSortedItems();
	const filters = SingleJobStore.getFilters();
	const selections = SelectionStore.getSelections();
	const pendingAction = ModalStore.getPendingAction();

	const hasChanged = AlertStore.getChangedStatus();
	const isLoading = AlertStore.getLoadStatus();
	const isUnsaved = AlertStore.getUnsavedStatus();
	const alert = AlertStore.getAlert();
	const profile = UserStore.getProfile();

	return {
		selections,
		items,
		details,
		filters,
		pendingAction,
		hasChanged,
		isLoading,
		isUnsaved,
		alert,
		profile
	};
}

export default connectToStores([
	SingleJobStore, SelectionStore,
	AlertStore, ModalStore,
	UserStore
	], getState)(SingleJobPage);

SingleJobPage.defaultProps = {
	tableScheme: [
		{ key: "-", 	        display: "", className: "fixed-col hid", type: "button",   onClick: ModalActionCreators.modifyPendingAction.bind(null, "DELETE", SharedActionCreators.deleteItem), inputClassName: "btn-left" },
		{ key: "pdf_rank",    display: "PDF", line2: "Order",                      className: "qty-xs",                  type: "number",   onChange: SharedActionCreators.changeItem, isNum: true },
		{ key: "product",     display: "Product",             otherContent: "pdf", className: "",                        type: "select",   onChange: SharedActionCreators.changeItem },
		{ key: "description", display: "Description",         otherContent: "pdf", className: "u-flex-grow2", maxRows: 3,            type: "textarea", onChange: SharedActionCreators.changeItem },
		{ key: "glass",       display: "Glass",               otherContent: "pdf", className: "",                        type: "select",   onChange: SharedActionCreators.changeItem },
		{ key: "metal",       display: "Metal",               otherContent: "pdf", className: "",                        type: "select",   onChange: SharedActionCreators.changeItem },
		{ key: "flex",        display: "Flex",                otherContent: "pdf", className: "",                        type: "select",   onChange: SharedActionCreators.changeItem },
		{ key: "flex_length", display: "Flex",line2: "Length (m)", otherContent: "pdf", className: "qty-sm",       type: "number",   onChange: SharedActionCreators.changeItem},
		{ key: "bulb",        display: "Bulb",                otherContent: "pdf", className: "",                        type: "select",   onChange: SharedActionCreators.changeItem },
		{ key: "ceilingrose", display: "CeilingRose", 		  otherContent: "pdf", className: "u-flex-grow2",			 type: "select",   onChange: SharedActionCreators.changeItem },
		{ key: "qty_req",     display: "Qty", line2: "Req", 	otherContent: "pdf", className: "qty-sm",
				type: "number",   onChange: SharedActionCreators.changeItem, isNum: true },
		{ key: "qty_hot",     display: "Qty", line2: "Hot", 											 className: "qty-sm",
				type: "number",   onChange: SharedActionCreators.changeItem, isNum: true, conditional: true },
		{ key: "qty_cold",    display: "Qty", line2: "Cold",                       className: "qty-sm",
				type: "number",   onChange: SharedActionCreators.changeItem, isNum: true, conditional: true },
		{ key: "qty_assem",   display: "Qty", line2: "Assem",                      className: "qty-sm",
				type: "number",   onChange: SharedActionCreators.changeItem, isNum: true, conditional: true },
{ key: "qty_packed",   display: "Qty", line2: "packed",                      className: "qty-sm",
		type: "number",   onChange: SharedActionCreators.changeItem, isNum: true, conditional: true },		
{ key: "notes",       display: "Notes",        className: "u-flex-grow3", maxRows: 3,           type: "textarea", onChange: SharedActionCreators.changeItem },
		{ key: "+", 	        display: "",             className: "fixed-col hid",           type: "button",   onClick: SharedActionCreators.createItem, inputClassName: "btn-right" }
	],
	detailsScheme: [
		{ key: "job_id",         display: "Job #:",            className: "",                   type: "text",     formattingFunc: rbPrefixer },
		{ key: "client",         display: "Client:",           className: "",                   type: "text",     onChange: SharedActionCreators.changeDetails },
		{ key: "project",        display: "Project:",          className: "",                   type: "text",     onChange: SharedActionCreators.changeDetails },
		{ key: "client_ref",     display: "Client Ref:",       className: "",                   type: "text",     onChange: SharedActionCreators.changeDetails },
		{ key: "notes",          display: "Notes:",            className: "u-flex-grow2 notes", type: "textarea", onChange: SharedActionCreators.changeDetails },
		{ key: "job_status",     display: "Job Status:",       className: "",                   type: "select",   onChange: SharedActionCreators.changeDetails, colored: true },
		{ key: "order_type",     display: "Order Type:",       className: "",                   type: "select",   onChange: SharedActionCreators.changeDetails },
		{ key: "updatedat",      display: "Last Update:",      className: "",                   type: "date",     formattingFunc: yyyyMMdd },
		{ key: "parts_status",   display: "Parts Status:",     className: "",                   type: "select",   onChange: SharedActionCreators.changeDetails },
		{ key: "parts_notes",    display: "Parts Notes:",      className: "u-flex-grow2 notes", type: "textarea", onChange: SharedActionCreators.changeDetails },
		{ key: "payment",        display: "Payment:",          className: "",                   type: "select",   onChange: SharedActionCreators.changeDetails },
		{ key: "shipping_date",  display: "Shipping Date:",    className: "",                   type: "date",     onChange: SharedActionCreators.changeDetails },
		{ key: "delivery_notes", display: "Delivery Notes:",  className: "u-flex-grow2 notes",  type: "textarea", onChange: SharedActionCreators.changeDetails },
		{ key: "contact_name",  display: "Contact Name:",      className: "", type: "text", onChange: SharedActionCreators.changeDetails },
		{ key: "contact_number",  display: "Contact No:",    className: "", type: "text", onChange: SharedActionCreators.changeDetails },
		{ key: "contact_email",  display: "Contact Email:",    className: "", type: "text", onChange: SharedActionCreators.changeDetails },
		{ key: "delivery_address",  display: "Delivery Address:",    className: "u-flex-grow2 notes", type: "textarea", onChange: SharedActionCreators.changeDetails }
		//{ key: "shipping_notes",  display: "Shipping Notes:",    className: "u-flex-grow2 notes", type: "textarea", onChange: SharedActionCreators.changeDetails }
	],
	routeScheme: [
		{ display: "Jobs", "to": "jobs" },
		{ display: "Items", "to": "items" },
		{ display: "Products", to: "products"}
	]
};
