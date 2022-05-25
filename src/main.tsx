import React from "react";
import ReactDOM from "react-dom";

import "./main.scss";

function importBuildTarget() {
  if (process.env.REACT_APP_ISPLAYER) {
    return import("./_player");
  } else {
    return import("./app");
  }
}

importBuildTarget().then(({ default: Environment }) => {
  ReactDOM.render(
    <React.StrictMode>
      <Environment />
    </React.StrictMode>,
    document.getElementById("root")
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
