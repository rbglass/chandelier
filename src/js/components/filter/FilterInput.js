"use strict";
import React, { Component, PropTypes } from "react";

const clearStyle = {
  "borderRadius": "20px",
  "width": "13px",
  "height": "13px",
  "lineHeight": "1px",
  "alignSelf": "center",
  "position": "absolute",
  "right": "3px",
  "top": "8px",
  "fontSize": "0.7rem",
  "fontWeight": "bolder",
  "margin": "0",
  "padding": "0",
  "content": "x",
  "backgroundColor": "#c8c8c8",
  "border": "none",
  "boxSizing": "border-box",
  "display": "flex",
  "alignItems": "center",
  "justifyContent": "center"
};

const wrapperStyle = {
	position: "relative",
	display: "flex"
};

const inputStyle = {
	paddingRight: "15px"
};

export default class FilterInput extends Component {
	filterChange(e) {
		this.props.setFilter(e.target.value);
	}
	clearClick() {
		this.props.setFilter("");
	}
	render() {

		return (
			<span className="filter-wrapper" style={wrapperStyle}>
				<input type={this.props.type}
						value={this.props.value}
						onChange={this.filterChange.bind(this)}
						className={this.props.className}
						placeholder={this.props.placeholder} style={inputStyle}/>
				<button style={clearStyle}
						className="filter-clear"
						onClick={this.clearClick.bind(this)} >
					x
				</button>
			</span>
		);
	}
}

FilterInput.propTypes = {
	value: PropTypes.string,
	setFilter: PropTypes.func.isRequired,
	className: PropTypes.string,
	placeholder: PropTypes.string
};
