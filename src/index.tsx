import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
// import App from "./app";
const App = lazy(() => import("./app"));
import PlayerRoot from "./_player";
import reportWebVitals from "./reportWebVitals";

import "./index.scss";

const isPlayer = process.env.REACT_APP_ISPLAYER;

function render() {
  ReactDOM.render(
    <React.StrictMode>
      {isPlayer ? (
        <PlayerRoot />
      ) : (
        <Suspense fallback={null}>
          <App />
        </Suspense>
      )}
    </React.StrictMode>,
    document.getElementById("root")
  );
}

const hot = (module as any).hot;
if (hot) {
  hot.accept(() => {
    render();
  });
}

render();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
