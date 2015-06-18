/**
* My static, heavily modified (some might say butchered),
* es6-ed version of https://github.com/marcio/react-skylightr
*	All credit for styles, the idea & the original version goes to the author
* https://github.com/marcio
*/

"use strict";

import React, { Component, PropTypes }  from "react";
import styles from "../styles/ModalStyles";
import objectAssign from "object-assign";

export default class Modal extends Component {
	handleKeyDown(e) {
		if (e.keyCode === 27) {
			this.props.hide();
		}
	}

	componentWillUpdate(nextProps) {
		if (nextProps.isVisible && this.props.beforeOpen) {
				this.props.beforeOpen();
		}

		if (!nextProps.isVisible && this.props.beforeClose) {
				this.props.beforeClose();
		}
	}

	componentDidUpdate(prevProps) {
			if (!prevProps.isVisible && this.props.afterOpen) {
					this.props.afterOpen();
			}

			if (prevProps.isVisible && this.props.afterClose) {
					this.props.afterClose();
			}
	}

	render() {

			let overlay;

			const dialogStyles = objectAssign(styles.dialogStyles, this.props.dialogStyles);
			const overlayStyles = objectAssign(styles.overlayStyles, this.props.overlayStyles);
			const closeButtonStyle = objectAssign(styles.closeButtonStyle, this.props.closeButtonStyle);

			if (this.props.isVisible) {
					overlayStyles.display = "block";
					dialogStyles.display = "block";
			} else {
					overlayStyles.display = "none";
					dialogStyles.display = "none";
			}

			if (this.props.showOverlay) {
					overlay = (<div className="modal-overlay" style={overlayStyles}></div>);
			}

			return (
					<section className="modal-wrapper" onKeyDown={this.handleKeyDown.bind(this)}>
							{overlay}
							<div className="modal-dialogue" style={dialogStyles}>
									<a role="button" style={closeButtonStyle} onClick={this.props.hide.bind(this)}>&times;</a>
									<h2>{this.props.title}</h2>
									{this.props.children}
							</div>
					</section>
			);
	}
}

Modal.propTypes = {
	title: PropTypes.string,
	isVisible: PropTypes.bool.isRequired,
	showOverlay: PropTypes.bool,
	hide: PropTypes.func.isRequired,
	beforeOpen: PropTypes.func,
	afterOpen: PropTypes.func,
	beforeClose: PropTypes.func,
	afterClose: PropTypes.func,
	overlayStyles: PropTypes.object,
	dialogStyles: PropTypes.object,
	closeButtonStyle: PropTypes.object
};

Modal.defaultProps = {
	title: "",
	isVisible: false,
	showOverlay: true,
	overlayStyles: styles.overlayStyles,
	dialogStyles: styles.dialogStyles,
	closeButtonStyle: styles.closeButtonStyle
};
