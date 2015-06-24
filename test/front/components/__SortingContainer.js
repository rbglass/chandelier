"use strict";
import I from "immutable";
import sinon from "sinon";
import assert from "assert";
import { job as samplejob } from "../testdata/job";
import React from "react/addons";
let { TestUtils } = React.addons;

import SortingContainer from "../../../src/js/components/sortable/SortingContainer";
import Row from "../../../src/js/components/sortable/Row";

describe("SortingContainer", () => {
	let RenderedComponent, renderedOutput, actualComponent;

	const jobId = samplejob.job_id;
	const rows = I.fromJS(samplejob.items);

	beforeEach(done => {
		RenderedComponent = TestUtils.renderIntoDocument(
			<SortingContainer job_id={jobId} rows={rows} />
		);

		renderedOutput = TestUtils.findRenderedDOMComponentWithClass(
			RenderedComponent,
			"sorting-container"
		);

		actualComponent = RenderedComponent.refs.child;
		done();
	});

	it("#sets its state to the rows passed down to it", () => {
		assert.equal(actualComponent.state.rows, rows);
	});

	it("#renders a Row for each element in rows", () => {
		const rowEls = renderedOutput.props.children.filter(e => e instanceof I.List).pop();
		assert.equal(rowEls.size, rows.size);

		rowEls.forEach(el => assert.equal(el.type, Row));
	});

	it("#renders an anchor", () => {
		assert(renderedOutput.props.children.filter(e => e.type === "a").length);
	});

	it("#has a moveRow method, that takes 2 ids, reorders the rows List, and sets state with the new List", () => {
		const moveRow = RenderedComponent.refs.child.moveRow;
		const firstRow = samplejob.items[0];
		const secondRow = samplejob.items[1];
		const prevStateRows = actualComponent.state.rows;

		moveRow(firstRow.item_id, secondRow.item_id);

		const newStateRows = actualComponent.state.rows;

		assert.notEqual(prevStateRows.last(), newStateRows.last());
		assert.equal(prevStateRows.first(), newStateRows.last());
		assert.equal(newStateRows.first(), prevStateRows.last());
	});

	it("#has a makeLinkHref method, that creates a query-stringed href from current state", () => {
		const comp = RenderedComponent.refs.child;
		const makeLinkHref = comp.makeLinkHref;
		const moveRow = comp.moveRow;
		const items = samplejob.items;

		const hrefWeExpect1 = `/api/jobs/${jobId}?pdf=true&0=${items[0].item_id}&1=${items[1].item_id}`;
		const hrefWeExpect2 = `/api/jobs/${jobId}?pdf=true&0=${items[1].item_id}&1=${items[0].item_id}`;

		assert.equal(makeLinkHref(), hrefWeExpect1);
		moveRow(items[0].item_id, items[1].item_id);
		assert.equal(makeLinkHref(), hrefWeExpect2);
	});
});
