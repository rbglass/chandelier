"use strict";
import React, { Component, PropTypes } from "react";
import Table from "../components/common/Table";
import NavBar from "../components/common/NavBar";
import Alert from "../components/common/Alert";
import SingleJobDetails from "../components/SingleJob/SingleJobDetails";
import SingleJobStore from "../stores/SingleJobStore";
import SelectionStore from "../stores/SelectionStore";
import AlertStore from "../stores/AlertStore";
import connectToStores from "../utils/connectToStores";
import * as SingleJobActionCreators from "../actions/SingleJobActionCreators";
import * as SharedActionCreators from "../actions/SharedActionCreators";

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
				<NavBar title={`RB${this.props.params.id}`} routeConfig={this.props.routeScheme}/>
				{(this.props.isLoading || this.props.alert) ?
					<Alert isLoading={this.props.isLoading} alert={this.props.alert} /> :
					<span />
				}
				<div className="container">
					<SingleJobDetails details={this.props.details} selections={this.props.selections}/>
					<div className="table-container">
						<Table {...this.props} primaryKey={"item_id"}
							onBlur={SharedActionCreators.saveItem}
							sortFunc={SharedActionCreators.sortBy}
						/>
					</div>
					<button className="add-button"
							onClick={SharedActionCreators.createItem.bind(this, this.props.details.job_id, {})}>
						+
					</button>
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
	const isLoading = AlertStore.getLoadStatus();
	const alert = AlertStore.getAlert();

	return {
		selections,
		details,
		items,
		filters,
		isLoading,
		alert
	};
}

export default connectToStores([SingleJobStore, SelectionStore, AlertStore], getState)(SingleJobPage);

SingleJobPage.defaultProps = {
	tableScheme: [
		{ key: "-", 	        display: "",             className: "fixed-col hid",           type: "button", inputClassName: "btn-left", onClick: SharedActionCreators.deleteItem   },
		{ key: "product",     display: "Product",      className: "",                        type: "select",   onChange: SharedActionCreators.changeItem },
		{ key: "description", display: "Description",  className: "u-flex-grow2",            type: "textarea", onChange: SharedActionCreators.changeItem },
		{ key: "glass",       display: "Glass",        className: "",                        type: "select",   onChange: SharedActionCreators.changeItem },
		{ key: "metal",       display: "Metal",        className: "",                        type: "select",   onChange: SharedActionCreators.changeItem },
		{ key: "flex",        display: "Flex",         className: "",                        type: "select",   onChange: SharedActionCreators.changeItem },
		{ key: "bulb",        display: "Bulb",         className: "",                        type: "select",   onChange: SharedActionCreators.changeItem },
		{ key: "qty_req",     display: "Qty",          className: "qty-sm", line2: "Req",    type: "number",   onChange: SharedActionCreators.changeItem },
		{ key: "qty_hot",     display: "Qty",          className: "qty-sm", line2: "Hot",    type: "number",   onChange: SharedActionCreators.changeItem },
		{ key: "qty_cold",    display: "Qty",          className: "qty-sm", line2: "Cold",   type: "number",   onChange: SharedActionCreators.changeItem },
		{ key: "qty_assem",   display: "Qty",          className: "qty-sm", line2: "Assem",  type: "number",   onChange: SharedActionCreators.changeItem },
		{ key: "qty_packed",  display: "Qty",          className: "qty-sm", line2: "Packed", type: "number",   onChange: SharedActionCreators.changeItem },
		{ key: "notes",       display: "Notes",        className: "u-flex-grow3",            type: "textarea", onChange: SharedActionCreators.changeItem },
		{ key: "+", 	        display: "",             className: "fixed-col hid",           type: "button", inputClassName: "btn-right", onClick: SharedActionCreators.createItem  }
	],
	routeScheme: [
		{ display: "Jobs", "to": "jobs" },
		{ display: "Items", "to": "items" }
	]
};
