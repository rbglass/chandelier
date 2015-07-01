"use strict";
import assert from "assert";
import sinon from "sinon";
import request from "superagent";
import ActionTypes from "../../../src/js/constants/ActionTypes";
import AppDispatcher from "../../../src/js/dispatchers/AppDispatcher";
import * as ServerActionCreators from "../../../src/js/actions/ServerActionCreators";

function stubFn(ref, toReturn, method) {
	return (...args) => {
		ref[method] = args.length > 1 ? args : args[0];
		return toReturn;
	};
}

export default {
	requestDouble(ref) {
		const bStub = stubFn.bind(null, ref, request.Request.prototype);

		const requestMethodsToStub = [
			"get",
			"post",
			"put",
			"del"
		];

		const protoMethodsToStub = [
			"query",
			"send",
			"end"
		];

		requestMethodsToStub.map(method => {
			sinon.stub(request, method, bStub(method));
		});

		protoMethodsToStub.map(method => {
			sinon.stub(request.Request.prototype, method, bStub(method));
		});

		return () => {
			requestMethodsToStub
							.concat(protoMethodsToStub)
							.forEach(method => method.restore());
		};
	},

	genericDouble(file, ref) {
		const gStub = stubFn.bind(null, ref, ref);
		const methodsToStub = Object.keys(file);

		let stubbed = methodsToStub.map(m => sinon.stub(file, m, gStub(m)));

		return () => stubbed.forEach(m => m.restore());
	},

	dispyDouble(type, data) {
		try {
			AppDispatcher.dispatch.restore();
		} catch (e) {
			void 0;
		}

		const st = sinon.stub(AppDispatcher, "dispatch", (action) => {
			assert.equal(action.type, ActionTypes[type]);
			assert.deepEqual(action.data, data);
		});

		return st;
	}
};
