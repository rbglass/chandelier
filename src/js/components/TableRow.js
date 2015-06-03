"use strict";
import { Component, PropTypes } from "react";
import TableCell from "./TableCell";
import { tilt } from "../utils/ConvenienceUtils";

export default class TableRow extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render() {
		const cells = tilt(this.props.cells).map((e, i) => {
			return <TableCell key={i} content={e.val} column={e.key}/>;
		});

		return (
			<div className="table-row">
				<div class="table-row-item fixed-col">
					<button class="btn btn-left">-</button>
				</div>
				{cells}
				<div class="table-row-item fixed-col">
					<button class="btn btn-right">+</button>
				</div>
			</div>
		);
	}
}

TableRow.propTypes = {
	cells: PropTypes.shape({
		item: PropTypes.string,
		product: PropTypes.string,
		description: PropTypes.string,
		glass: PropTypes.string,
		metal: PropTypes.string,
		flex: PropTypes.string,
		bulb: PropTypes.string,
		qty_hot: PropTypes.number,
		qty_cold: PropTypes.number,
		qty_assem: PropTypes.number,
		qty_packed: PropTypes.number,
		notes: PropTypes.string
	})
};

//Classnames
