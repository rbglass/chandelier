"use strict";
import React, { Component, PropTypes } from "react";
import TableHeader from "./TableHeader";

export default class Table extends Component {
	render() {
		const rows = this.props.items.map((row, i) => {
			return <this.props.RowComponent key={i} cells={row} cellConfig={this.props.cellConfig}/>;
		}, this);
		return (
			<div className="table">
				<TableHeader filters={this.props.filters} headers={this.props.headers} />
				{rows}
			</div>
		);
	}
}
