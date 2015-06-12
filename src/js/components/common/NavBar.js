"use strict";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class NavBar extends Component {

	render() {

		return (
			<div className="nav navbar">
				<div className="nav nav-title">
					{this.props.title}
				</div>
				{	this.props.routeConfig.map((linkConfig, i) => {
						return (
							<div key={i} className="nav nav-item">
								<Link to={linkConfig.to}>{linkConfig.display}</Link>
							</div>
						);
					})
				}
				<div className="nav nav-item logout">
					<a href="/logout">Logout</a>
				</div>
			</div>
		);
	}
}

NavBar.PropTypes = {
		routeConfig: PropTypes.arrayOf(PropTypes.shape({
			display: PropTypes.string,
			to: PropTypes.string
		})).isRequired,
		title: PropTypes.string
};
