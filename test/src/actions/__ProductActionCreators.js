"use strict";
import assert from "assert";
import sinon from "sinon";
import testPlease from "../helpers/testPlease";
import * as JobsAPI from "../../../src/js/api/JobsAPI";
import * as ProductActionCreators from "../../../src/js/actions/ProductActionCreators";

const toTest = [

	{
		fn: "sortBy",
		type: "SORT_PRODUCTS",
		give: ["doctor"],
		want: "doctor",
		desc: "a sort string"
	},

	{
		fn: "setFilter",
		type: "FILTER_PRODUCTS_BY",
		give: ["hat"],
		want: "hat",
		desc: "a filter string"
	},

	{
		fn: "setStartDate",
		type: "SET_PRODUCTS_START_DATE",
		give: [new Date(Date.UTC(2015, 11, 5))],
		want: "2015-12-05",
		desc: "a start date"
	},

	{
		fn: "setEndDate",
		type: "SET_PRODUCTS_END_DATE",
		give: [new Date(Date.UTC(2015, 3, 5))],
		want: "2015-04-05",
		desc: "an end date"
	},

	{
		fn: "restrictTo",
		type: "RESTRICT_PRODUCTS_TO",
		give: ["key", "opts"],
		want: { key: "key", options: "opts"},
		desc: "a restriction obj"
	},

	{
		fn: "clearProductsFilters",
		type: "CLEAR_PRODUCTS_FILTERS",
		give: [],
		desc: "an action"
	}
];

describe("ProductActionCreators", () => {

	it(".createSingleProduct calls JobsAPI.createSingleProduct", () => {
		let result;

		const stub = sinon.stub(JobsAPI, "createSingleProduct", () => {
			result = true;
		});

		ProductActionCreators.createSingleProduct();
		assert(result);
		stub.restore();
	});

	it(".saveProduct calls JobsAPI.saveProduct with the id and product", () => {
		let result;

		const stub = sinon.stub(JobsAPI, "saveProduct", (id, prod) => {
			result = {
				id: id,
				data: prod
			};
		});

		ProductActionCreators.saveProduct(12, "hello mate");
		assert.equal(result.id, 12);
		assert.equal(result.data, "hello mate");
		stub.restore();
	});

	it(".deleteSingleProduct calls JobsAPI.deleteSingleProduct with an immutable object's id", () => {
		let result;

		const mockImm = {
			get(thing) {
				return 53;
			}
		};

		const stub = sinon.stub(JobsAPI, "deleteSingleProduct", (id) => {
			result = id;
		});

		ProductActionCreators.deleteSingleProduct(null, mockImm);
		assert.equal(result, 53);
		stub.restore();
	});

	testPlease(toTest, ProductActionCreators);
});
