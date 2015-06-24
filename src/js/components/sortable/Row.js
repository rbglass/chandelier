"use strict";
import IPropTypes from "react-immutable-proptypes";
import React, { PropTypes } from "react";
import ItemTypes from "../../constants/ItemTypes";
import { DragSource, DropTarget } from "react-dnd";
import objectAssign from "object-assign";
import compose from "../../utils/compose";

const style = {
	border: "1px dashed gray",
	padding: "0.3rem 0",
	marginBottom: ".5rem",
	backgroundColor: "white",
	cursor: "move",
	boxSizing: "border-box"
};

const rowSource = {
	beginDrag(props) {
		return { id: props.id };
	}
};

const rowTarget = {
	hover(props, monitor) {
		const draggedId = monitor.getItem().id;

		if (draggedId !== props.id) {
			props.moveRow(draggedId, props.id);
		}
	}
};

function targetCollect(connect) {
	return {
		connectDropTarget: connect.dropTarget()
	};
}

function sourceCollect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	};
}

class Row {
	render() {
		const { cells, isDragging, connectDragSource, connectDropTarget } = this.props;
		const opacity = isDragging ? 0 : 1;

		return connectDragSource(connectDropTarget(
			<div style={objectAssign(style, opacity)} className="table-row">
				<div className="table-row-item qty-sm">
					{cells.get("qty_req")}
				</div>
				<div className="table-row-item">
					{cells.get("product")}
				</div>
				<div className="table-row-item">
					{cells.get("glass")}
				</div>
				<div className="table-row-item">
					{cells.get("metal")}
				</div>
				<div className="table-row-item">
					{cells.get("flex")}
				</div>
				<div className="table-row-item">
					{cells.get("bulb")}
				</div>
			</div>
		));
	}
}

export default compose(
	DropTarget(ItemTypes.ROW, rowTarget, targetCollect),
	DragSource(ItemTypes.ROW, rowSource, sourceCollect)
)(Row);

Row.propTypes = {
	connectDragSource: PropTypes.func.isRequired,
	connectDropTarget: PropTypes.func.isRequired,
	isDragging: PropTypes.bool.isRequired,
	id: PropTypes.string.isRequired,
	cells: IPropTypes.map.isRequired,
	moveRow: PropTypes.func.isRequired
};
