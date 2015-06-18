"use strict";
import IPropTypes from "react-immutable-proptypes";
import React, { Component, PropTypes } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

export default class Table extends Component {
	shouldComponentUpdate(nextProps) {
		return ( nextProps.items !== this.props.items ||
							nextProps.selections !== this.props.selections ||
							nextProps.filters !== this.props.filters);
	}
	render() {
		const rows = this.props.items.map((row, i) => {
			return <TableRow key={i} cells={row} cellConfig={this.props.tableScheme}
								selections={this.props.selections} primaryKey={this.props.primaryKey}
								onBlur={this.props.onBlur}
							/>;
		}, this);
		return (
			<div className="table">
				<TableHeader filters={this.props.filters} headers={this.props.tableScheme}
						sortFunc={this.props.sortFunc}
				/>
				{rows}
			</div>
		);
	}
}

Table.PropTypes = {
	tableScheme: PropTypes.arrayOf(PropTypes.object),
	items: IPropTypes.listOf(IPropTypes.map),
	selections: IPropTypes.listOf(PropTypes.map),
	filters: IPropTypes.map,
	primaryKey: PropTypes.string,
	onBlur: PropTypes.func,
	sortFunc: PropTypes.func
};
