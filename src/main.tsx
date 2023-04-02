import Header from "./Header";
import Timer from "./Timer";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Header />
		<Timer />
	</React.StrictMode>
);
