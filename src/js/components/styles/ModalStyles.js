"use strict";

export default {
	overlayStyles: {
		position: "fixed",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		zIndex: 9999999999,
		backgroundColor: "rgba(0,0,0,0.3)"
	},
	dialogStyles: {
		width: "50%",
		position: "fixed",
		top: "100px",
		left: "50%",
		marginLeft: "-25%",
		backgroundColor: "#fff",
		borderRadius: "2px",
		zIndex: 100000000000,
		textAlign: "center",
		padding: "10px",
		boxShadow: "0 0 4px rgba(0,0,0,.14),0 4px 8px rgba(0,0,0,.28)",
		maxHeight: "75%",
		overflowY: "auto"
	},
	closeButtonStyle: {
		cursor: "pointer",
		float: "right",
		fontSize: "1.6em",
		margin: "-15px 0"
	}
};
