"use strict";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class NavBar extends Component {

	render() {
		let children = <span />;

		if (Array.isArray(this.props.children)) {
			children = this.props.children.map((kid, i) =>
				<div key={i + "" + i} className="nav nav-item">
					{kid}
				</div>
			);
		} else if (this.props.children) {
			children = <div className="nav nav-item">{this.props.children}</div>;
		}

		return (
			<div className="nav navbar">
				{ this.props.title ?
					<div className="nav nav-title">
						{this.props.title}
					</div> : <span style={{display: "none"}}/>
				}
				{	this.props.routeConfig ?
					<div className="nav nav-links">
						{ this.props.routeConfig.map((linkConfig, i) =>
								<div key={i} className="nav nav-item">
									<Link to={linkConfig.to}>{linkConfig.display}</Link>
								</div>
							)
						} </div>
					: <span />
				}
			{children}
			</div>
		);
	}
}

NavBar.PropTypes = {
		routeConfig: PropTypes.arrayOf(PropTypes.shape({
			display: PropTypes.string,
			to: PropTypes.string
		})),
		title: PropTypes.string
};
