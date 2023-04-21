import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux'

import "./index.css";
import Theme from "./utils/Theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Theme />
  </>
);
