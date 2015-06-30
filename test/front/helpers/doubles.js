"use strict";
import sinon from "sinon";
import request from "superagent";
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

	ServerActionCreatorsDouble(ref) {
		const sStub = stubFn.bind(null, ref, ref);
		const serverMethodsToStub = Object.keys(ServerActionCreators);

		serverMethodsToStub.map(method =>
			sinon.stub(ServerActionCreators, method, sStub(method))
		);

		return () => {
			serverMethodsToStub.forEach(method => method.restore());
		};
	}
};
