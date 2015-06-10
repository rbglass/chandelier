"use strict";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class NavBar extends Component {

	render() {

		return (
			<div className="nav navbar">
				<div className="nav nav-item">
					<Link to="jobs">Jobs</Link>
				</div>
				<div className="nav nav-item">
					<Link to="items">Items</Link>
				</div>
				<div className="nav nav-item">
					<a href="/logout">Logout</a>
				</div>
				<div className="nav nav-title">
					{this.props.title}
				</div>
			</div>
		);
	}
}
