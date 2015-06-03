"use strict";
import { Component, PropTypes } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

export default class Table extends Component {
	render() {
		const rows = this.props.rows.map((row, i) => {
			return <TableRow key={i} cells={row} />;
		});
		return (
			<div className="table">
				<TableHeader headers={this.props.headers} />
				{rows}
			</div>
		);
	}
}

Table.propTypes = {

};
