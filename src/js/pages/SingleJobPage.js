"use strict";
import React, { Component, PropTypes } from "react";
import Table from "../components/common/Table";
import NavBar from "../components/common/NavBar";
import SingleJobDetails from "../components/SingleJob/SingleJobDetails";
import SingleJobStore from "../stores/SingleJobStore";
import SelectionStore from "../stores/SelectionStore";
import connectToStores from "../utils/connectToStores";
import * as SingleJobActionCreators from "../actions/SingleJobActionCreators";
import * as SharedActionCreators from "../actions/SharedActionCreators";

function requestDataFromServer(id) {
	SharedActionCreators.getSelections();
	SingleJobActionCreators.getSingleJob(id);
}

class SingleJobPage extends Component {

	componentWillMount() {
		requestDataFromServer(this.props.params.id);
	}

	render() {
		return (
			<div>
				<NavBar title={`${this.props.params.id}`}/>
				<div className="container">
					<SingleJobDetails details={this.props.details} selections={this.props.selections}/>
					<Table {...this.props} primaryKey={"item_id"}
						onBlur={SingleJobActionCreators.saveItem.bind(this, this.props.details.job_id)}
						sortFunc={SharedActionCreators.sortBy}
					/>
					<button className="add-button" onClick={SingleJobActionCreators.createItem.bind(this, this.props.details.job_id, {})}>
						+
					</button>
				</div>
			</div>
		);
	}
}

SingleJobPage.defaultProps = {
	tableScheme: [
		{ key: "-", 	       display: "",         className: "fixed-col",
				type: "button", inputClassName: "btn-left", onClick: SingleJobActionCreators.deleteItem   },
		{ key: "item_id", 	 display: "Item",       className: "qty-sm",
				type: "",         onChange: SingleJobActionCreators.changeItem },
		{ key: "product",    display: "Product",    className: "",
				type: "text",     onChange: SingleJobActionCreators.changeItem },
		{ key: "description", display: "Description", className: "u-flex-grow3",
				type: "textarea", onChange: SingleJobActionCreators.changeItem },
		{ key: "glass",      display: "Glass",      className: "",
				type: "text",     onChange: SingleJobActionCreators.changeItem },
		{ key: "metal",      display: "Metal",      className: "",
				type: "text",     onChange: SingleJobActionCreators.changeItem },
		{ key: "flex",       display: "Flex",       className: "",
				type: "text",     onChange: SingleJobActionCreators.changeItem },
		{ key: "bulb",       display: "Bulb",       className: "",
				type: "text",     onChange: SingleJobActionCreators.changeItem },
		{ key: "qty_req",    display: "Qty Req",    className: "qty-sm",
				type: "number",   onChange: SingleJobActionCreators.changeItem },
		{ key: "qty_hot",    display: "Qty Hot",    className: "qty-sm",
				type: "number",   onChange: SingleJobActionCreators.changeItem },
		{ key: "qty_cold",   display: "Qty Cold",   className: "qty-sm",
				type: "number",   onChange: SingleJobActionCreators.changeItem },
		{ key: "qty_assem",  display: "Qty Assem",  className: "qty-md",
				type: "number",   onChange: SingleJobActionCreators.changeItem },
		{ key: "qty_packed", display: "Qty Packed", className: "qty-md",
				type: "number",   onChange: SingleJobActionCreators.changeItem },
		{ key: "notes",      display: "Notes",      className: "u-flex-grow3",
				type: "textarea", onChange: SingleJobActionCreators.changeItem },
		{ key: "+", 	       display: "",         className: "fixed-col",
				type: "button", inputClassName: "btn-right", onClick: SingleJobActionCreators.createItem  }
	]
};


function getState() {
	const details = SingleJobStore.getJobDetails();
	const items = SingleJobStore.getSortedItems();
	const filters = SingleJobStore.getFilters();
	const selections = SelectionStore.getSelections();

	return {
		selections,
		details,
		items,
		filters
	};
}

export default connectToStores([SingleJobStore, SelectionStore], getState)(SingleJobPage);
