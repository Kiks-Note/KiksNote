import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import Theme from "./utils/Theme";
import "./index.css";
import { store } from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Theme />
  </Provider>
);
