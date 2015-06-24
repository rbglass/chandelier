"use strict";
import IPropTypes from "react-immutable-proptypes";
import React, { Component, PropTypes } from "react";
import Row from "./Row";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd/modules/backends/HTML5";

class SortingContainer extends Component {
	constructor(props) {
		super(props);
		this.moveRow = this.moveRow.bind(this);
		this.makeLinkHref = this.makeLinkHref.bind(this);
		this.state = {
			rows: this.props.rows
		};
		// Setting state based on props as this is a completely isolated
		// component but still needs to be stateful for sorting
	}

	moveRow(id, afterId) {
		const { rows } = this.state;

		const row = rows.find(c => c.get("item_id") === id);
		const rowIndex = rows.indexOf(row);
		const afterRow = rows.find(c => c.get("item_id") === afterId);
		const afterIndex = rows.indexOf(afterRow);

		this.setState(prevState => {
			const minusOne = prevState.rows.splice(rowIndex, 1);
			const newRows = minusOne.splice(afterIndex, 0, row);
			return {
				rows: newRows
			};
		});
	}

	makeLinkHref() {
		const { rows } = this.state;
		const { job_id } = this.props;
		let baseHref = `/api/jobs/${job_id}?pdf=true`;

		const flatRows = rows.map(row => row.get("item_id"));

		for(let i = 0; i < flatRows.size; i += 1) {
			baseHref += `&${i}=${flatRows.get(i)}`;
		}
		return baseHref;
	}

	render() {
		const { rows } = this.state;

		return (
			<div className="sorting-container">
				<div className="table-header">
					<div className="table-row-item qty-sm">
						qty_req
					</div>
					<div className="table-row-item">
						product
					</div>
					<div className="table-row-item">
						glass
					</div>
					<div className="table-row-item">
						metal
					</div>
					<div className="table-row-item">
						flex
					</div>
					<div className="table-row-item">
						bulb
					</div>
				</div>
				{rows.map(row => {
					return (
						<Row key={row.get("item_id")}
									id={row.get("item_id")}
									cells={row}
									moveRow={this.moveRow} />
					);
				})}
				<a href={this.makeLinkHref()} target="_blank">
					<input className="pdfButton" type="button" value="PDF"/>
				</a>
			</div>
		);
	}
}

export default DragDropContext(HTML5Backend)(SortingContainer);

Component.propTypes = {
	job_id: PropTypes.string,
	rows: IPropTypes.listOf(IPropTypes.shape({
		item_id: PropTypes.string.isRequired
	}))
};
