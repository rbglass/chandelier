"use strict";
import IPropTypes from "react-immutable-proptypes";
import React, { Component, PropTypes } from "react/addons";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import bindToInstance from "../../utils/bindToInstance";

let { CSSTransitionGroup } = React.addons;

export default class Table extends Component {
	constructor(props) {
		super(props);
		bindToInstance(this, "handleResize");
	}

	componentWillMount() {
		this.shouldFlash = false;
	}

	componentDidMount() {
		if (!this.props.isInfinite) return;

		window.addEventListener("resize", this.handleResize);
		const bodyHeight = React.findDOMNode(this.refs.body).clientHeight;
		// this.setRowsPerBody(bodyHeight)
	}

	shouldComponentUpdate(nextProps) {
		const shouldIt =  nextProps.items !== this.props.items ||
											nextProps.selections !== this.props.selections ||
											nextProps.filters !== this.props.filters;

		return shouldIt;
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
			this._scrollToBottom();
		}
	}

	componentWillUnmount() {
		if (!this.props.isInfinite) return;

		window.removeEventListener("resize", this.handleResize);
	}

	handleResize() {
		if (!this.props.isInfinite) return;

		let tableNode = React.findDOMNode(this.refs.body);
		// this.doSomethingWithNewHeight(tableNode.clientHeight);
	}

	handleScroll() {
		if (!this.props.isInfinite) return;

		let tableNode = React.findDOMNode(this.refs.body);
		// this.doSomething(tableNode.scrollTop);
	}

	render() {
		const shouldFlash = this.shouldFlash;
		const rows = this.props.items.map((row, i) =>
			<TableRow key={i} cells={row} cellConfig={this.props.tableScheme}
					selections={this.props.selections} primaryKey={this.props.primaryKey}
					onBlur={this.props.onBlur}
			/>
		);
		const [dummyTop, dummyBottom] = this.props.isInfinite ? this._createDummyElements() : [null, null];

		return (
			<div className="table">
				<TableHeader filters={this.props.filters} headers={this.props.tableScheme}
						sortFunc={this.props.sortFunc}
				/>
				<CSSTransitionGroup className="table-body" ref="body"
						component="div" transitionName="flash" transitionEnter={shouldFlash}
						transitionLeave onScroll={this.handleScroll.bind(this)}>
					{dummyTop}
					{rows}
					{dummyBottom}
				</CSSTransitionGroup>
			</div>
		);
	}

	_createDummyElements() {
		const dummyTopHeight = this.props.renderStart * this.props.rowHeight;
		const dummyBottomHeight = (this.props.total - this.props.displayEnd) * this.props.rowHeight;

		const dummyTop = <div style={{height: dummyTopHeight, width: "100%"}} />;
		const dummyBottom = <div style={{height: dummyBottomHeight, width: "100%"}} />;

		return [dummyTop, dummyBottom];
	}

	_scrollToBottom() {
		let tableNode = React.findDOMNode(this.refs.body);
		tableNode.scrollTop = tableNode.scrollHeight;
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

	focusOnEntry: PropTypes.bool,
	isInfinite: PropTypes.bool
};
