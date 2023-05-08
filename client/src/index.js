import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux'
import Theme from "./utils/Theme";

import "./index.css";
import App from "./App";
import { store } from './redux/store';

import "./index.css";
import App from "./App";
import { store } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}Provider store={store}>
    {/* <App /> */}
    <Theme />
  </>
);
