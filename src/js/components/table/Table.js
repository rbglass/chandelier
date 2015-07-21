"use strict";
import IPropTypes from "react-immutable-proptypes";
import React, { Component, PropTypes } from "react/addons";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

let { CSSTransitionGroup } = React.addons;

export default class Table extends Component {
	shouldComponentUpdate(nextProps) {
		const shouldIt =  nextProps.items !== this.props.items ||
											nextProps.selections !== this.props.selections ||
											nextProps.filters !== this.props.filters;

		return shouldIt;
	}

	componentWillMount() {
		this.shouldFlash = false;
	}

	componentWillUpdate(nextProps) {
		if (!this.props.focusOnEntry) return;

		if (this.props.items.size === 0) return;

		this.shouldFlash = true;
	}

	componentDidUpdate(prevProps) {
		if (!this.props.focusOnEntry) return;

		const { items } = this.props;
		const oldItems = prevProps.items;

		if (items.size === oldItems.size + 1) {
			this.scrollToBottom();
		}
	}

	scrollToBottom() {
		let tableNode = React.findDOMNode(this.refs.body);
		tableNode.scrollTop = tableNode.scrollHeight;
	}

	render() {
		const shouldFlash = this.shouldFlash;
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
				<CSSTransitionGroup className="table-body" ref="body"
						component="div" transitionName="flash" transitionEnter={shouldFlash}
						transitionLeave >
					{rows}
				</CSSTransitionGroup>
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
	sortFunc: PropTypes.func,
	focusOnEntry: PropTypes.bool
};
