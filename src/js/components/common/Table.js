"use strict";
import React, { Component, PropTypes } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

export default class Table extends Component {
	render() {
		const rows = this.props.items.map((row, i) => {
			return <TableRow key={i} cells={row} cellConfig={this.props.tableScheme}
								selections={this.props.selections} primaryKey={this.props.primaryKey} onBlur={this.props.onBlur} />;
		}, this);
		return (
			<div className="table">
				<TableHeader filters={this.props.filters} headers={this.props.tableScheme} />
				{rows}
			</div>
		);
	}
}
