"use strict";
import React, { Component } from "react";
import bindToInstance from "./bindToInstance";

export default function connectToStores(arrayOfStores, getStateFromStores) {
	return function(ComponentToConnect) {
		return class StoreConnector extends Component {

			constructor() {
				super();
				this.state = getStateFromStores();

				const methods = ["onStoreChange"];
				bindToInstance(this, methods);
			};

			componentWillMount() {
				arrayOfStores.forEach(store =>
					store.addChangeListener(this.onStoreChange)
				);
			}

			componentWillUnmount() {
				arrayOfStores.forEach(store =>
					store.removeChangeListener(this.onStoreChange)
				);
			}

			onStoreChange() {
				this.setState(getStateFromStores());
			}

			render() {
				return <ComponentToConnect {...this.state} {...this.props} />;
			}
		};
	};
}
