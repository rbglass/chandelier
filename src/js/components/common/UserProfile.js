"use strict";
import React, { Component, PropTypes } from "react";

export default class UserProfile extends Component {
	shouldComponentUpdate(nextProps) {
		const shouldIt = (nextProps.user !== this.props.user ||
											nextProps.avatar !== this.props.avatar);

		return shouldIt;
	}

	render() {
		return (
			<div className="nav nav-item profile">
				<img className="profile-avatar" src={this.props.avatar} />
				<div className="profile-user">{this.props.user || "No name"}</div>
			</div>
		);
	}
}

UserProfile.propTypes = {
	user: PropTypes.string,
	avatar: PropTypes.string
};
